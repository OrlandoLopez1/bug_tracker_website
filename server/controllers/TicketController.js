const Ticket = require('../models/Ticket');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const Project = require("../models/Project");
const Attachment = require('../models/Attachment');
const Comment = require('../models/Comment');
const {deleteFile} = require("../s3utils");


// @desc Create a new ticket
// @route POST /tickets
// @access Private
const addTicket = asyncHandler(async (req, res) => {
    try {
        const { title, description, assignedBy, assignedTo, type, status, priority, project, attachment } = req.body;
        const ticket = new Ticket({
            title,
            description,
            assignedBy,
            assignedTo,
            type,
            status,
            priority,
            project,
            attachments: attachment ? [attachment] : []
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
        const savedTicket = await ticket.save();
        res.status(201).json({ message: 'Ticket created', ticket: savedTicket }); // Returning the created ticket

    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ message: 'Error creating ticket', error: error.message });
    }
});


// @desc Get a specific ticket by id
// @route GET /tickets/:id
// @access Private
const getTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
        return res.status(404).json({ message: 'Cannot find ticket' });
    }
    res.json(ticket);
});


// @desc Update a specific ticket
// @route PATCH /tickets/:id
// @access Private
const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket', error: error.message });
    }
});



// @desc Delete a specific ticket
// @route DELETE /tickets/:id
// @access Private
//todo verify that the value of tickets assigned gets incremented
const deleteTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const ticket = await Ticket.findById(id)
        console.log("(delete)Ticket: ", ticket)
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        await User.findByIdAndUpdate(ticket.assignedTo, { $inc: { totalAssignedTickets: -1 } }, { new: true });


        const { attachments } = ticket;
        for (const attachmentUrl of attachments) {
            const fileName = attachmentUrl.substring(attachmentUrl.lastIndexOf("/") + 1);

            try {
                await deleteFile(process.env.AWS_S3_BUCKET, fileName);
            } catch (err) {
                console.log(`Failed to delete file ${fileName} from S3: ${err}`);
                return res.status(500).json({ message: `Failed to delete file ${fileName} from S3` });
            }
        }

        await Ticket.findByIdAndRemove(id);
        console.log(`Deleted ticket ${id}`);

        res.json({ message: 'Ticket deleted' });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ message: 'Error deleting dicket', error: error.message });
    }
});



// Import the Attachment model at the top of your file


const updateTicketAttachment = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { attachment } = req.body;

    if (!attachment) {
        return res.status(400).json({ message: 'No attachment URL provided' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
        return res.status(404).json({ message: 'No ticket found with the provided ID' });
    }

    // Create a new Attachment document
    const createdAttachment = await Attachment.create(attachment);

    // Add the ObjectId of the created Attachment to the ticket's attachments array
    ticket.attachments.push(createdAttachment._id);

    await ticket.save();

    res.json({ message: 'Attachment successfully added to ticket', ticket });
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
    updateTicketAttachment,
    getTicket,
    getTickets,
    getTicketsForProject
};
