const express = require('express')
const router = express.Router()
const userRouter = require('./user.router')
const isAuth = require('../middlewares/isAuth')
router.get('/checkstatus', (req, res, next) => {
	res.status(200).json({
		status: 'success',
		message: 'api ok',
	})
})
router.use(isAuth)
userRouter(router)

module.exports = router
