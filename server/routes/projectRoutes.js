const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(projectController.getProjects)
    .post(projectController.addProject);

router.route('/:projectId')
    .get(projectController.getProject)
    .patch(projectController.updateProject)
    .delete(projectController.deleteProject);

router.route('/:projectId/users')
    .get(projectController.getUsersForProject);

router.route('/:projectId/pageOfUsers')
    .get(projectController.getPageOfUsersForProject);

router.route('/:projectId/pageOfTickets')
    .get(projectController.getPageOfTicketsForProject);

router.route('/:projectId/pageOfUsersNotInProject')
    .get(projectController.getPageOfUsersNotInProject);

router.route('/:projectId/tickets')
    .get(projectController.getTicketsForProject);

router.route('/:projectId/tickets/:ticketId')
    .post(projectController.addTicketToProject)
    .delete(projectController.removeTicketFromProject);


router.route('/:projectId/users/:userId')
    .post(projectController.addUserToProject)
    .patch(projectController.removeUserFromProject);

module.exports = router;
