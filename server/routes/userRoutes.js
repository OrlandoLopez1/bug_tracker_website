const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUser);

router.route('/roles')
    .get(userController.getAllUsersOfRole);

router.route('/:userId')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

router.route('/:userId/projects')
    .get(userController.getUserProjects);

router.route('/:userId/tickets')
    .get(userController.getUserTickets);

module.exports = router;
