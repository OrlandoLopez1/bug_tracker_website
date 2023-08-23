const Project = require('../models/Project');
const Ticket = require('../models/Ticket');
const Attachment = require('../models/Attachment');
const Comment = require('../models/Comment');
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
// @route GET /projects/:projectId
// @access Private
const getProject = asyncHandler(async (req, res) => {
    const { projectId} = req.params;
    const project = await Project.findById(projectId);
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
// @route PATCH /projects/:projectId
// @access Private
const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    try {
        const oldProject = await Project.findById(projectId);
        const updatedProject = await Project.findByIdAndUpdate(projectId, req.body, { new: true }).populate('users');

        // Find any new users that were added
        const oldUsers = oldProject.users.map(user => user._id.toString());
        const newUsers = updatedProject.users.map(user => user._id.toString());
        const addedUsers = newUsers.filter(user => !oldUsers.includes(user));
        const removedUsers = oldUsers.filter(user => !newUsers.includes(user));

        // Add this project to the project array of each added user
        for (let userId of addedUsers) {
            await User.findByIdAndUpdate(userId, { $push: { projects: updatedProject._id } }, { new: true });
        }

        for (let userId of removedUsers) {
            await User.findByIdAndUpdate(userId, { $pull: {projects: updatedProject._id }}, { new: true})
        }

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
});


// @desc Delete a specific project
// @route DELETE /projects/:projectId
// @access Private
const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    try {
        const tickets = await Ticket.find({ project: projectId });

        const deletedTicketsResult = await Ticket.deleteMany({ project: projectId });

        const project = await Project.findById( projectId );

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

        await Project.findByIdAndRemove( projectId );
        console.log(`Deleted project ${projectId}`);

        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
});

// @desc Get all users associated with a specific project
// @route GET /projects/:projectId/users
// @access Private
const getUsersForProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await Project.findById(projectId).populate('users');
        if (!project) {
            return res.status(404).json({ message: 'Cannot find project' });
        }
        res.json(project.users);
    } catch (error) {
        res.status(500).json({ message: 'Error getting users for project', error: error.message });
    }
});

// @desc Gets only a specific amount of users within a project to display
// @route GET /projects/:projectId/pageOfUsers
// @access Private
const getPageOfUsersForProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    console.log(`Getting users for project ID: ${projectId}, Page: ${page}, Page Size: ${pageSize}`); // Debugging statement

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            console.error(`Project with ID ${projectId} not found`); // Debugging statement
            return res.status(404).json({ message: 'Cannot find project' });
        }

        console.log(`Found project: ${JSON.stringify(project.name)}`); // Debugging statement

        const users = await User.find({ 'projects': projectId })
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .exec();

        const totalUsers = await User.countDocuments({ 'projects': projectId });

        console.log(`Users found: ${JSON.stringify(users)} Total Users: ${totalUsers}`); // Debugging statement

        res.json({
            users: users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / pageSize)
        });
    } catch (error) {
        console.error(`Error getting users for project: ${error.message}`); // Debugging statement
        res.status(500).json({ message: 'Error getting users for project', error: error.message });
    }
});



// @desc Gets only a specific amount of users not in a specific project to display
// @route GET /projects/:projectId/pageOfUsersNotInProject
// @access Private
const getPageOfUsersNotInProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Cannot find project' });
        }

        const usersInProject = project.users.map(user => user._id);

        const users = await User.find({ _id: { $nin: usersInProject } })
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .exec();

        const totalUsers = await User.countDocuments({ _id: { $nin: usersInProject } });

        res.json({
            users: users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / pageSize)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error getting users not in project', error: error.message });
    }
});

// @desc Get all tickets associated with a specific project
// @route GET /projects/:projectId/tickets
// @access Private
const getTicketsForProject = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;  // assuming that the project ID is sent as a URL parameter

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

// @desc Remove a user from a project along with tickets associated with the project
// @route PATCH /projects/:projectId/users/:UserId
// @access Private

const removeUserFromProject = asyncHandler( async (req, res) => {
    const { projectId, userId } = req.params;
    try {
        console.log("Start REMOVE USER")
        const project = await Project.findById(projectId).populate({
            path: 'tickets',
            model: 'Ticket'
        });
        console.log("1")
        const user = await User.findById(userId);
        console.log(project)
        console.log("1.5")
        const filteredTickets = project.tickets.filter(ticket => ticket.assignedTo.includes(userId));
        console.log("2")

        for (let ticketToUpdate of filteredTickets) {
            const updatedTicket = await Ticket.findByIdAndUpdate(ticketToUpdate._id, {$pull: {assignedTo: userId}}, {new: true});
            const updatedUser = await User.findByIdAndUpdate(userId, {$pull: {tickets: ticketToUpdate._id}}, {new: true})
        }
        console.log("3")
        const updatedProject = await Project.findByIdAndUpdate(projectId, {$pull: {users: userId}}, {new: true})
        const updatedUser = await User.findByIdAndUpdate(userId, {$pull: {projects: projectId}}, {new: true})
        res.status(200).json({ message: 'User successfully removed from project and tickets'});
    } catch (error) {
        console.log("555555555555555555555555")
        res.status(500).json({ message: 'Error removing user from project and tickets', error: error.message });
    }
});

const addUserToProject = asyncHandler ( async (req, res) => {
    const { projectId, userId } = req.params;
    try {
        await Project.findByIdAndUpdate(projectId, {$push: {users: userId}}, {new: true})
        await User.findByIdAndUpdate(userId, {$push: {projects: projectId}}, {new: true})
        res.status(200).json({ message: 'User successfully added to project'});
    } catch (error) {
        res.status(500).json({ message: 'Error removing user from project', error: error.message });
    }
});

const removeTicketFromProject = asyncHandler( async (req, res) => {
    console.log("RemoveTicketsFromProjectCalled");
    const { projectId, ticketId} = req.params;
    console.log(`tickets ID: ${ticketId}`)

    try {
        const ticket = await Ticket.findById(ticketId).populate([
            {
                path: 'attachments',
                model: 'Attachment'
            },
            {
                path: 'comments',
                model: 'Comment'
            }]
        )
        console.log(`current ticket: ${ticket}`)
        for (attachmentId of ticket.attachments) {
            console.log(`current attachment: ${attachmentId}`);
            await Attachment.findByIdAndRemove(attachmentId);
        }

        for (commentId of ticket.comments) {
            console.log(`current comment: ${commentId}`);
            await Comment.findByIdAndRemove(commentId);
        }
        await Project.findByIdAndUpdate(projectId, {$pull: {tickets: ticketId}}, {new: true});
        await Ticket.findByIdAndRemove(ticketId);
        console.log("Finished Deletion process")
        res.status(200).json("Tickets successfully removed");

    } catch {
        res.status(500).json("Something went wrong in the ticket removal process");
    }
});

module.exports = {
    addProject,
    getProject,
    getProjects,
    updateProject,
    deleteProject,
    getUsersForProject,
    getPageOfUsersNotInProject,
    getPageOfUsersForProject,
    getTicketsForProject,
    addTicketToProject,
    addUserToProject,
    removeUserFromProject,
    removeTicketFromProject
};
