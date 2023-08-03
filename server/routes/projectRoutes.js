const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(projectController.getProjects)
    .post(projectController.addProject);

router.route('/:id')
    .get(projectController.getProject)
    .patch(projectController.updateProject)
    .delete(projectController.deleteProject);

router.route('/:id/users')
    .get(projectController.getUsersForProject);

router.route('/:id/tickets')
    .get(projectController.getTicketsForProject);

router.route('/:projectId/tickets/:ticketId')
    .patch(projectController.addTicketToProject);

router.route('/:projectId/users/:userId')
    .patch(projectController.removeUserFromProject);


module.exports = router;
