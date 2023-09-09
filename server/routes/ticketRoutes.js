const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/TicketController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(ticketController.getTickets)
    .post(ticketController.addTicket);

router.route('/:ticketId')
    .get(ticketController.getTicket)
    .patch(ticketController.updateTicket);

router.route('/:ticketId/attachment')
    .put(ticketController.updateTicketAttachment)

router.route('/:ticketId/comment')
    .put(ticketController.addComment);

module.exports = router;
