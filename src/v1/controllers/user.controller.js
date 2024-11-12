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
			const user = await userService.getUserById({ id: req.params.id })
			res.json(user)
		} catch (error) {
			return this.handleResponseError(res, error)
		}
	}
	async updateUser(req, res) {
		try {
			const user = await userService.updateUser({ id: req.params.id, data: req.body })
			res.json(user)
		} catch (error) {
			return this.handleResponseError(res, error)
		}
	}
}

module.exports = new UserController()
