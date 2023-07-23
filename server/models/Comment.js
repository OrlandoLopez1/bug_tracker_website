const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    uploader: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }] // users who upvoted this comment
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
