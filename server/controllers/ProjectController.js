const Project = require('../models/Project');
const Ticket = require('../models/Ticket');
const User = require('../models/User')
const asyncHandler = require('express-async-handler');

// @desc Add a new project
// @route POST /projects
// @access Private
const addProject = asyncHandler(async (req, res) => {
    try {
        const { name, projectDescription, projectManager, priority, currentStatus, deadline, users, tickets } = req.body;
        const project = new Project({
            name,
            projectDescription,
            projectManager,
            priority,
            currentStatus,
            deadline,
            users,
            tickets
        });
        const savedProject = await project.save();

        // Add this project to the project array of each user
        if (users && users.length > 0) {
            for (let userId of users) {
                await User.findByIdAndUpdate(userId, { $push: { projects: savedProject._id } }, { new: true });
            }
        }
        if (projectManager) {
            await User.findByIdAndUpdate(projectManager, { $push: { projects: savedProject._id } }, { new: true });
        }

        res.status(201).json(savedProject);
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
        const oldProject = await Project.findById(id);
        const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });

        // Find any new users that were added
        const oldUsers = oldProject.users;
        const newUsers = updatedProject.users;
        const addedUsers = newUsers.filter(user => !oldUsers.includes(user));

        // Add this project to the project array of each added user
        for (let userId of addedUsers) {
            await User.findByIdAndUpdate(userId, { $push: { projects: updatedProject._id } }, { new: true });
        }

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

        const deletedTicketsResult = await Ticket.deleteMany({project: id});
        console.log(`Deleted ${deletedTicketsResult.deletedCount} tickets`);

        const project = await Project.findById(id);
        // Find all users associated with the project and remove the project from their projects array
        await User.updateMany(
            { _id: { $in: project.users } },
            { $pull: { projects: project._id } }
        );
        if (project.projectManager){
            await User.findByIdAndUpdate(
                project.projectManager,
                {$pull: {projects: project._id}}
                )
        }

        await Project.findByIdAndRemove(id);
        console.log(`Deleted project ${id}`);

        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
});

// @desc Get all users associated with a specific project
// @route GET /projects/:id/users
// @access Private
const getUsersForProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id).populate('users');
        if (!project) {
            return res.status(404).json({ message: 'Cannot find project' });
        }
        res.json(project.users);
    } catch (error) {
        res.status(500).json({ message: 'Error getting users for project', error: error.message });
    }
});


// @desc Get all tickets associated with a specific project
// @route GET /projects/:id/tickets
// @access Private
const getTicketsForProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id;  // assuming that the project ID is sent as a URL parameter

    try {
        const project = await Project.findById(projectId).populate({
            path: 'tickets',
            model: 'Ticket',
            populate: {
                path: 'assignedTo',
                model: 'User'
            }
        });

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        res.json(project.tickets);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});







// @desc Add a new ticket to a specific project
// @route PATCH /projects/:projectId/tickets/:ticketId
// @access Private
const addTicketToProject = asyncHandler(async (req, res) => {
    const { projectId, ticketId } = req.params;
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $push: { tickets: ticketId } },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Cannot find project' });
        }

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Error adding ticket to project', error: error.message });
    }
});


module.exports = {
    addProject,
    getProject,
    getProjects,
    updateProject,
    deleteProject,
    getUsersForProject,
    getTicketsForProject,
    addTicketToProject,
};
