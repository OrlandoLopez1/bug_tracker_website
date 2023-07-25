const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUser)


router.route('/:userId')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


module.exports = router