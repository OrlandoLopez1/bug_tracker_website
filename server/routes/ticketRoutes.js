const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(ticketController.getTickets)
    .post(ticketController.addTicket);

router.route('/project/:projectId')
    .get(ticketController.getTicketsForProject);

router.route('/:id')
    .get(ticketController.getTicket)

router.route('/:id/attachment')
    .put(ticketController.updateTicketAttachment)

router.route('/:id/comment')
    .put(ticketController.addComment);

module.exports = router;
