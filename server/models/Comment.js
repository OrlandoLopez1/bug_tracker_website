const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    uploader: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
