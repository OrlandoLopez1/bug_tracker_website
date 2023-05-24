const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    assignedBy: { type: String, required: true },
    assignedTo: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true, default: 'open' },
    priority: { type: String, required: true, default: 'medium' },
    project: { type: Schema.Types.ObjectId, ref: 'Project' }  // Here is the reference to Project
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
