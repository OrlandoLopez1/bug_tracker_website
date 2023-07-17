const Comment = require('../models/Comment');
const asyncHandler = require('express-async-handler');

// @desc Add a comment to a ticket
// @route POST /comments
// @access Private
const addComment = asyncHandler(async (req, res) => {
    const { uploader, content, ticket } = req.body;
    const comment = new Comment({
        uploader,
        content,
        ticket,
    });

    const savedComment = await comment.save();

    res.status(201).json({ message: 'Comment added', comment: savedComment });
});

// @desc Get comments for a specific ticket
// @route GET /comments/ticket/:ticketId
// @access Private
const getCommentsForTicket = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;
    const comments = await Comment.find({ ticket: ticketId });

    res.json(comments);
});

module.exports = {
    addComment,
    getCommentsForTicket
};
