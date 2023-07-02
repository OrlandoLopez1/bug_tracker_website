const Project = require('../models/Project');
const Ticket = require('../models/Ticket');
const User = require('../models/User')
const asyncHandler = require('express-async-handler');

// @desc Add a new project
// @route POST /projects
// @access Private
const addProject = asyncHandler(async (req, res) => {
    try {
        const { name, projectDescription, projectManager, priority, currentStatus, deadline } = req.body;
        const project = new Project({
            name,
            projectDescription,
            projectManager,
            priority,
            currentStatus,
            deadline,
        });
        await project.save();

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
});

// @desc Get a specific project by id
// @route GET /projects/:id
// @access Private
const getProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
        return res.status(404).json({ message: 'Cannot find project' });
    }
    res.json(project);
});

// @desc Get all projects
// @route GET /projects
// @access Private
const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({});
    if (!projects) {
        return res.status(4040).json({message: 'Cannot find projects'});
    }
    res.json(projects);

});

// @desc Update a specific project
// @route PATCH /projects/:id
// @access Private
const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
});

// @desc Delete a specific project
// @route DELETE /projects/:id
// @access Private
const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const tickets = await Ticket.find({ project: id });
        console.log(`Found ${tickets.length} tickets associated with project ${id}`);

        const usersPromises = tickets.map(async (ticket) => {
            console.log(`Decrementing ticket count for user ${ticket.assignedTo}`);
            const updatedUser = await User.findByIdAndUpdate(ticket.assignedTo, { $inc: { totalAssignedTickets: -1 } }, { new: true });
            console.log('Updated user:', updatedUser);
            return updatedUser;
        });

        // Wait for all user updates to complete
        await Promise.all(usersPromises);

        const deletedTicketsResult = await Ticket.deleteMany({project: id});
        console.log(`Deleted ${deletedTicketsResult.deletedCount} tickets`);

        await Project.findByIdAndRemove(id);
        console.log(`Deleted project ${id}`);

        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
});


module.exports = {
    addProject,
    getProject,
    getProjects,
    updateProject,
    deleteProject
};
