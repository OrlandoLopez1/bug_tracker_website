const mongoose = require('mongoose');
//todo consider adding deadline
const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    projectDescription: {
        type: String,
    },
    projectManager: {
        type: String
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: null
    },
    deadline: {
        type: Date,
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
