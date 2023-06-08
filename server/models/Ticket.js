const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// todo allow option for attachments, tags, and comments
const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true },
    status: { type: String, required: true, default: 'open' },
    priority: { type: String, required: true, default: 'medium' },
    project: { type: Schema.Types.ObjectId, ref: 'Project' }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
