const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')

router.get('/profile', userController.getUserById)
router.patch('/profile', userController.updateUser)
router.patch('/profile/address', userController.updateUserAddress)
router.patch('/profile/password', userController.updatePassword)
router.delete('/profile', userController.deleteUser)

module.exports = router
