const express = require('express')
const router = express.Router()
const userRouter = require('./user.router')
const adminRouter = require('./admin.router')
const isAuth = require('../middlewares/isAuth')

router.get('/checkstatus', (req, res, next) => {
	res.status(200).json({
		status: 'success',
		message: 'api ok',
	})
})
router.use(isAuth)

router.use('/v1/admin', adminRouter)

router.use('/v1/user', userRouter)

module.exports = router
