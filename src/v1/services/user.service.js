const Address = require('../models/address.model')
const Role = require('../models/role.model')
const User = require('../models/user.model')
const { REDIS_SET, REDIS_GET, REDIS_DEL } = require('./redis.service')

class usesrService {
	async getUserById({ id: userId }) {
		let user
		const cacheKey = `data-user:${userId}`
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
		const updateUser = await User.update({ ...data }, { where: { user_id: userId } })
		if (updateUser[0] === 1) {
			await REDIS_DEL(`data-user:${userId}`)
			return await this.getUserById({ id: userId })
		} else {
			throw new Error('User not found')
		}
	}
}

module.exports = new usesrService()
