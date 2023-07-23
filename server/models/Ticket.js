const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// todo allow option for comments
// todo also allow for several users to be assigned to a ticket
const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    type: {
        type: String,
        required: true,
        enum: ['bug', 'feature request', 'improvement', 'maintenance', 'security', 'documentation', 'ui/ux',
            'performance', 'compatibility', 'other']
    },
    status: { type: String, required: true, default: 'open' },
    priority: { type: String, required: true, default: 'medium' },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    attachments: [{type: Schema.Types.ObjectId, ref: 'Attachment'}] ,
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}] ,

}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
