const Project = require('../models/project.js');
const Folder = require('../models/folder.js');
const File = require('../models/file.js');

// POST Create a Project
const createProject = async (req, res) => {
    const { name, description, owner } = req.body;
    try {
        const project = await Project.create({ name, description, owner });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET Retrieve a Project by ID
const getProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await Project.findById(id).populate('owner');
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT Update a Project
const updateProject = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const project = await Project.findByIdAndUpdate(id, updates, { new: true });
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE Delete a Project
const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete all files and folders in the project
        await File.deleteMany({ project: id });
        await Folder.deleteMany({ project: id });

        // Delete the project itself
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json({ message: "Project, its files, and folders deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createProject,
    getProject,
    updateProject,
    deleteProject,
};
