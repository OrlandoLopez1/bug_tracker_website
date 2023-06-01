const Project = require('../models/Project');
const asyncHandler = require('express-async-handler');

// @desc Add a new project
// @route POST /projects
// @access Private
const addProject = asyncHandler(async (req, res) => {
    try {
        const { name, projectDescription, projectManager, priority, currentStatus } = req.body;
        const project = new Project({
            name,
            projectDescription,
            projectManager,
            priority,
            currentStatus
        });
        await project.save();
        res.status(201).json({ message: 'Project created' });
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
        await Project.findByIdAndRemove(id);
        res.json({ message: 'Project deleted' });
    } catch (error) {
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
