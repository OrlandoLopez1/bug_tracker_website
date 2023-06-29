const Ticket = require('../models/Ticket');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc Create a new ticket
// @route POST /tickets
// @access Private
const addTicket = asyncHandler(async (req, res) => {
    try {
        const { title, description, assignedBy, assignedTo, type, status, priority, project } = req.body;
        const ticket = new Ticket({
            title,
            description,
            assignedBy,
            assignedTo,
            type,
            status,
            priority,
            project
        });
        console.log("Assigned to: ", assignedTo); // debug print

        if (assignedTo) {
            console.log("Incrementing tickets for user ID: ", assignedTo); // debug print
            await User.findByIdAndUpdate(assignedTo, { $inc: { totalAssignedTickets: 1 } });
        }
        await ticket.save();
        res.status(201).json({ message: 'Ticket created' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            console.log(error);
            res.status(400).json({ message: 'Error validating ticket', error: error.message });
        } else if (error.name === 'MongoError') {
            res.status(500).json({ message: 'Error saving ticket to database', error: error.message });
        } else {
            res.status(500).json({ message: 'Unknown server error', error: error.message });
        }
    }
});

// @desc Get a ticket by title
// @route GET /tickets/:title
// @access Private
const getTicket = asyncHandler(async (req, res) => {
    const { title } = req.query;
    const ticket = await Ticket.findOne({ title: title });
    if (!ticket) {
        return res.status(404).json({ message: 'Cannot find ticket' });
    }
    res.json(ticket);
});

// @desc Get all tickets
// @route GET /tickets
// @access Private
const getTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({});
    res.json(tickets);
});

// @desc Get tickets for a specific project
// @route GET /tickets/project/:projectId
// @access Private
const getTicketsForProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const tickets = await Ticket.find({ project: projectId });
    res.json(tickets);
});

module.exports = {
    addTicket,
    getTicket,
    getTickets,
    getTicketsForProject
};
