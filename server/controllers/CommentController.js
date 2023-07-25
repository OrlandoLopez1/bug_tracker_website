const Comment = require('../models/Comment');
const asyncHandler = require('express-async-handler');
const Ticket = require("../models/Ticket");
const Attachment = require("../models/Attachment");

// @desc Creates a comment
// @route POST /comments
// @access Private
const addComment = asyncHandler(async (req, res) => {
    const { uploader, content, ticket } = req.body;
    const comment = new Comment({
        uploader,
        content,
        ticket
    });

    const savedComment = await comment.save();

    res.status(201).json({ message: 'comment added', comment: savedComment });
});


// @desc Get a specific comment by id
// @route GET /comment/:id
// @access Private
const getComment = asyncHandler( async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
        return res.status(404).json({message: 'Cannot find comment'});
    }
    res.json(comment);
});


// @desc Get comments for a specific ticket
// @route GET /comments/ticket/:ticketId
// @access Private
const getCommentsForTicket = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;
    const comments = await Comment.find({ ticket: ticketId })
        .populate('uploader');

    res.json(comments);
});



// @desc Update a comment
// @route PUT /comments/:id
// @access Private
const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (comment) {
        comment.content = content;
        const updatedComment = await comment.save();
        res.json(updatedComment);
    } else {
        res.status(404);
        throw new Error('Comment not found');
    }
});

// @desc Delete a comment
// @route DELETE /comments/:id
// @access Private
const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);

    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    await Ticket.updateOne(
        { _id: comment.ticket },
        { $pull: { comments: commentId } }
    );
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Comment deleted successfully' });
});



module.exports = {
    addComment,
    getComment,
    getCommentsForTicket,
    updateComment,
    deleteComment,
};