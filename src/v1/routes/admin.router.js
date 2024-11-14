const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')

router.get('/users', adminController.getlistUsers)
router.get('/roles', adminController.getAllRole)
router.post('/users/:targetUserId/role/', adminController.updateUserRole)
router.post('/role', adminController.createRole)
router.patch('/role/:id', adminController.updateRole)
router.delete('/role/:id', adminController.deleteRole)

module.exports = router
