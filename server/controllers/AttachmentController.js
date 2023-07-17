const Attachment = require('../models/Attachment');
const asyncHandler = require('express-async-handler');

// @desc Add an attachment to a ticket
// @route POST /attachments
// @access Private
const addAttachment = asyncHandler(async (req, res) => {
    const { filename, path, uploader, ticket } = req.body;
    const attachment = new Attachment({
        filename,
        path,
        uploader,
        ticket,
    });

    const savedAttachment = await attachment.save();

    res.status(201).json({ message: 'Attachment added', attachment: savedAttachment });
});

// @desc Get attachments for a specific ticket
// @route GET /attachments/ticket/:ticketId
// @access Private
const getAttachmentsForTicket = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;
    const attachments = await Attachment.find({ ticket: ticketId });

    res.json(attachments);
});

module.exports = {
    addAttachment,
    getAttachmentsForTicket
};
