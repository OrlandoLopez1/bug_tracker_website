const Project = require('../models/Project');

exports.addProject = async (req, res) => {
    try {
        const project = new Project({
            projectName: req.body.projectName,
            projectDescription: req.body.projectDescription,
            projectManager: req.body.projectManager,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            priority: req.body.priority,
            currentStatus: req.body.currentStatus
        });
        await project.save();
        res.status(201).json({ message: 'Project created' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

exports.getProject = async (req, res) => {
    const id = req.params.id;
    const project = await Project.findById(id);

    if (project == null) {
        return res.status(404).json({message: 'Cannot find project'})
    }

    res.json(project);
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({});
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error getting projects', error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};
