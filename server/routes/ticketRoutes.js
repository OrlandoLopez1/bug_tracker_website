const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(ticketController.getTickets)
    .post(ticketController.addTicket);

router.route('/:ticketId')
    .get(ticketController.getTicket)

router.route('/:ticketId/attachment')
    .put(ticketController.updateTicketAttachment)

router.route('/:ticketId/comment')
    .put(ticketController.addComment);

module.exports = router;
