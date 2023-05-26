const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(ticketController.getTickets)
    .post(ticketController.addTicket);

router.route('/:title')
    .get(ticketController.getTicket);

router.route('/project/:projectId')
    .get(ticketController.getTicketsForProject);

module.exports = router;
