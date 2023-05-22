const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    assignedBy: { type: String, required: true },
    assignedTo: { type: String, required: true },
    type: { type: String, required: true },
    project_name: { type: String, required: true },
    status: { type: String, required: true, default: 'open' },
    priority: { type: String, required: true, default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
