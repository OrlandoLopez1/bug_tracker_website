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
            const updatedUser = await User.findByIdAndUpdate(
                assignedTo,
                {
                    $push: { tickets: ticket._id }
                },
                { new: true }
            );

            if (!updatedUser) {
                throw new Error("User not found, could not add ticket to user");
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
// @route GET /tickets/:ticketId
// @access Private
const getTicket = asyncHandler(async (req, res) => {
    const {ticketId} = req.params;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        return res.status(404).json({ message: 'Cannot find ticket' });
    }
    res.json(ticket);
});


// @desc Update a specific ticket
// @route PATCH /tickets/:ticketId
// @access Private
const updateTicket = asyncHandler(async (req, res) => {
    const {ticketId} = req.params;
    try {
        const oldTicket = await Ticket.findById(ticketId);
        const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, req.body, { new: true });

        // Check if the assigned user has changed
        const oldAssignedUser = oldTicket.assignedTo;
        const newAssignedUser = updatedTicket.assignedTo;
        if (newAssignedUser !== oldAssignedUser) {
            // Add this ticket to the tickets array of the new assigned user
            await User.findByIdAndUpdate(newAssignedUser, { $push: { tickets: updatedTicket._id } }, { new: true });

            // If there was an old assigned user, remove this ticket from their tickets array
            if (oldAssignedUser) {
                await User.findByIdAndUpdate(oldAssignedUser, { $pull: { tickets: updatedTicket._id } }, { new: true });
            }
        }

        res.json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket', error: error.message });
    }
});



// @desc Delete a specific ticket
// @route DELETE /tickets/:ticketId
// @access Private
//todo verify that the value of tickets assigned gets incremented
const deleteTicket = asyncHandler(async (req, res) => {
    const {ticketId} = req.params;
    try {
        const ticket = await Ticket.findById(ticketId)
        console.log("(delete)Ticket: ", ticket)
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        await User.findByIdAndUpdate(ticket.assignedTo, { $pull: { tickets: ticketId } }, { new: true });


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

        await Ticket.findByIdAndRemove(ticketId);
        console.log(`Deleted ticket ${ticketId}`);

        res.json({ message: 'Ticket deleted' });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ message: 'Error deleting dicket', error: error.message });
    }
});


const updateTicketAttachment = asyncHandler(async (req, res) => {
    const ticketId = req.params.ticketId;
    const { attachment } = req.body;

    if (!attachment) {
        return res.status(400).json({ message: 'No attachment URL provided' });
    }

    const ticket = await Ticket.findById(ticketId);
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


// @desc Add a comment to a ticket
// @route POST /comments
// @access Private
const addComment = asyncHandler(async (req, res) => {
    console.log('Received request in addComment: ', req.body);  // Log the received request body

    const { uploader, content, ticket } = req.body.comment;


    if (!content) {
        console.log('No comment content provided');
        return res.status(400).json({ message: 'No comment provided' });
    }

    console.log('Attempting to find ticket: ', ticket);
    const ticketDoc = await Ticket.findById(ticket);
    if (!ticketDoc) {
        console.log('Could not find ticket: ', ticket);
        return res.status(404).json({ message: 'No ticket found with provided ID' });
    }

    console.log('Creating comment with uploader: ', uploader, ', content: ', content, ', ticket: ', ticket);
    const commentDoc = await Comment.create({
        uploader: uploader,
        content: content,
        ticket: ticket,
    });

    console.log('Pushing comment ID to ticket comments: ', commentDoc._id);
    ticketDoc.comments.push(commentDoc._id);

    console.log('Saving modified ticket');
    await ticketDoc.save();

    console.log('Returning response: ', { message: 'Comment added', comment: commentDoc });
    res.status(201).json({ message: 'Comment added', comment: commentDoc });
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
//todo fix this
const getTicketsForProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const tickets = await Ticket.find({ project: projectId });
    res.json(tickets);
});

module.exports = {
    addTicket,
    updateTicketAttachment,
    updateTicket,
    addComment,
    getTicket,
    getTickets,
    getTicketsForProject
};
