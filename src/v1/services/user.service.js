const bcrypt = require('bcrypt')
const Address = require('../models/address.model')
const Role = require('../models/role.model')
const User = require('../models/user.model')
const UserAddress = require('../models/userAddress.model')
const {
	TargetNotExistException,
	BadRequestException,
} = require('../utils/exceptions/commonException')
const { REDIS_SET, REDIS_GET, REDIS_DEL, REDIS_SETEX } = require('./redis.service')
const { sequelize } = require('../configs/databases/init.mysql')

class usesrService {
	async getUserById({ id: userId }) {
		let user
		const cacheKey = `data_user:${userId}`
		try {
			user = await REDIS_GET(cacheKey)
		} catch (e) {
			console.log('get user data from redis failed', e)
		}

		if (user) {
			return JSON.parse(user)
		}

		user = await User.findByPk(userId, {
			attributes: ['user_id', 'username', 'email', 'phone', 'avatarUrl'], // Only include these fields
			include: [
				{
					model: Role,
					attributes: ['role_id', 'role_name'], // Only include role_id and role_name from the Role model
				},
				{
					model: Address,
					through: {
						attributes: ['address_type'], // Include the address_type field from the UserAddress join table
					},
					attributes: [
						'address_id',
						'latitude',
						'longitude',
						'street',
						'city',
						'state',
						'country',
						'formatted',
					], //  the address fields want to retrieve
				},
			],
		})

		if (user) {
			await REDIS_SET(cacheKey, JSON.stringify(user), 'EX', 3600)
		}
		return user
	}

	async updateUser({ id: userId, data }) {
		try {
			// Attempt to update the user
			const [updatedRows] = await User.update({ ...data }, { where: { user_id: userId } })

			if (updatedRows === 0) {
				throw new Error('User not found')
			}

			// Clear cached user data and return updated user data
			await REDIS_DEL(`data_user:${userId}`)
			return await this.getUserById({ id: userId })
		} catch (error) {
			console.error('Error updating user:', error)
			throw new Error(error.message || 'Failed to update user')
		}
	}

	async deleteUser({ id: userId }) {
		const transaction = await sequelize.transaction()

		try {
			const deleted = await User.destroy({ where: { user_id: userId }, transaction })

			if (!deleted) {
				throw new TargetNotExistException()
			}

			await transaction.commit()

			try {
				await Promise.all([REDIS_DEL(`data_user:${userId}`), REDIS_DEL(`user_token:${userId}`)])
			} catch (redisError) {
				throw new Error('Failed to delete Redis cache for user')
			}

			return true
		} catch (error) {
			await transaction.rollback()

			console.error('Error deleting user:', error)
			throw new Error(error.message || 'Failed to delete user')
		}
	}

	async updatePassword({ oldPassword, newPassword, id: userId }) {
		try {
			const user = await User.findOne({ where: { user_id: userId } })
			if (!user) throw new TargetNotExistException()

			const isMatch = await bcrypt.compare(oldPassword, user.password_hash)
			if (!isMatch) {
				throw new BadRequestException('Old password is incorrect')
			}

			const salt = await bcrypt.genSalt(10)
			const passwordHash = await bcrypt.hash(newPassword, salt)

			await User.update({ password_hash: passwordHash, salt }, { where: { user_id: userId } })

			await REDIS_DEL(`data_user:${userId}`)
			await this.getUserById({ id: userId })
			return true
		} catch (error) {
			console.error('Error updating password:', error)
			throw new Error(error.message || 'Failed to update password')
		}
	}

	async updateUserAddress({ id: userId, addressData }) {
		try {
			const addressFields = {
				latitude: addressData.query.lat,
				longitude: addressData.query.lon,
				name: addressData.features[0]?.properties.name || '',
				village: addressData.features[0]?.properties.village || '',
				county: addressData.features[0]?.properties.county || '',
				suburb: addressData.features[0]?.properties.suburb || '',
				quarter: addressData.features[0]?.properties.quarter || '',
				street: addressData.features[0]?.properties.street || '',
				housenumber: addressData.features[0]?.properties.housenumber || '',
				city: addressData.features[0]?.properties.city || '',
				state: addressData.features[0]?.properties.state || '',
				country: addressData.features[0]?.properties.country || '',
				country_code: addressData.features[0]?.properties.country_code || '',
				formatted: addressData.features[0]?.properties.formatted || '',
				plus_code: addressData.query.plus_code,
				plus_code_short: addressData.features[0]?.properties.plus_code_short || '',
			}

			let address = await Address.findOne({
				where: { latitude: addressFields.latitude, longitude: addressFields.longitude },
			})

			if (address) {
				await address.update(addressFields)

				const existingUserAddress = await UserAddress.findOne({
					where: { user_id: userId, address_id: address.address_id },
				})
				if (!existingUserAddress) {
					await UserAddress.create({
						user_id: userId,
						address_id: address.address_id,
						address_type: addressData.addressType,
					})
				} else
					await UserAddress.update(
						{
							address_type: addressData.addressType,
						},
						{ where: { user_id: userId, address_id: address.address_id } }
					)
			} else {
				address = await Address.create(addressFields)
				await UserAddress.create({
					user_id: userId,
					address_id: address.address_id,
					address_type: addressData.addressType,
				})
			}

			await REDIS_DEL(`data_user:${userId}`)

			return await this.getUserById({ id: userId })
		} catch (error) {
			console.error('Error updating user address:', error)
			throw new Error(error.message || 'Failed to update user address')
		}
	}

	// async requestPasswordReset(email) {
	// 	const user = await User.findOne({ where: { email } })
	// 	if (!user) throw new Error('User not found')

	// 	const resetToken = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
	// 		expiresIn: '1h',
	// 	})
	// 	await redisClient.set(`resetToken:${user.user_id}`, resetToken, { EX: 3600 }) // 1 hour
	// 	// Send resetToken to user's email
	// 	return resetToken
	// }

	// // Reset password using token
	// async resetPassword(userId, token, newPassword) {
	// 	const storedToken = await redisClient.get(`resetToken:${userId}`)
	// 	if (!storedToken || storedToken !== token) throw new Error('Invalid or expired token')

	// 	const salt = await bcrypt.genSalt(10)
	// 	const passwordHash = await bcrypt.hash(newPassword, salt)

	// 	await User.update({ password_hash: passwordHash, salt }, { where: { user_id: userId } })
	// 	await REDIS_DEL(`resetToken:${userId}`)
	// 	return true
	// }
}

module.exports = new usesrService()
