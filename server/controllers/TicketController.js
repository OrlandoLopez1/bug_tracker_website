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

        // Validate ticket first
        const validationError = ticket.validateSync();
        if (validationError) {
            return res.status(400).json({ message: 'Validation error', error: validationError });
        }

        // If ticket is valid and assignedTo is provided, increment user's ticket count
        if (assignedTo && title !== '') {
            const updatedUser = await User.findByIdAndUpdate(assignedTo, { $inc: { totalAssignedTickets: 1 } }, { new: true });
            if (!updatedUser) {
                throw new Error("User not found, could not increment tickets");
            }
        }

        // Now save the ticket
        await ticket.save();
        res.status(201).json({ message: 'Ticket created' });

    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ message: 'Error creating ticket', error: error.message });
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
