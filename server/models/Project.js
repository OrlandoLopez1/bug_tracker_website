const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    projectManager: {
        type: String
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    currentStatus: {
        type: String,
        enum: ['Planning', 'In progress', 'Testing', 'Stalled', 'Completed'],
        default: 'Planning'
    },

});

module.exports = mongoose.model('Project', ProjectSchema);
