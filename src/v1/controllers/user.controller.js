const BasicController = require('../utils/controllers/basicController')
const bindMethodsWithThisContext = require('../utils/classes/bindMethodsWithThisContext')
const userService = require('../services/user.service')

class UserController extends BasicController {
	constructor() {
		super()
		bindMethodsWithThisContext(this)
	}
	async getUserById(req, res) {
		try {
			const user = await userService.getUserById({ id: req?.user.user_id })
			res.json(user)
		} catch (error) {
			return this.handleResponseError(res, error)
		}
	}
	async updateUser(req, res) {
		try {
			const user = await userService.updateUser({ id: req?.user.user_id, data: req.body })
			res.json(user)
		} catch (error) {
			return this.handleResponseError(res, error)
		}
	}

	async updateUserAddress(req, res) {
		try {
			const updateUser = await userService.updateUserAddress({
				id: req?.user.user_id,
				addressData: req.body,
			})
			res.json(updateUser)
		} catch (error) {
			return this.handleResponseError(res, error)
		}
	}

	async updatePassword(req, res) {
		try {
			const updateUser = await userService.updatePassword({
				id: req?.user.user_id,
				...req.body,
			})
			res.json(updateUser)
		} catch (error) {
			return this.handleResponseError(res, error)
		}
	}
	async deleteUser(req, res) {
		try {
			const updateUser = await userService.deleteUser({
				id: req?.user.user_id,
			})
			if (updateUser) {
				res.clearCookie('refreshToken')
				res.clearCookie('accessToken')
			}
			res.json(updateUser)
		} catch (error) {
			return this.handleResponseError(res, error)
		}
	}
}

module.exports = new UserController()
