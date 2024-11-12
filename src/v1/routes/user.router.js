const userController = require('../controllers/user.controller')

const userRouter = router => {
	router.get('/profile/:id', userController.getUserById)
	router.patch('/profile/:id', userController.updateUser)
}

module.exports = userRouter
