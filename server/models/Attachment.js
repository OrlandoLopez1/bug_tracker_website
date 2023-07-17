// models/Attachment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attachmentSchema = new mongoose.Schema({
    filename: { type: String, required: true }, //todo redundant as file name is at the end of path remove later
    path: { type: String, required: true },
    uploader: { type: Schema.Types.ObjectId, ref: 'User' },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' }
}, { timestamps: true });

module.exports = mongoose.model('Attachment', attachmentSchema);
