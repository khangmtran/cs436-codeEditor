const File = require('../models/file.js')
const Folder = require('../models/folder.js')
const Project = require('../models/project.js')


// POST Create a File
const createFile = async (req, res) => {
    const { name, content, type, parentFolder, project } = req.body;
    try {
        const file = await File.create({ name, content, type, parentFolder, project });
        res.status(200).json(file);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET Get a File
const getFile = async (req, res) => {
    const { id } = req.params;
    try {
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }
        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT Update a File
const updateFile = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const file = await File.findByIdAndUpdate(id, updates, { new: true });
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }
        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE Delete a File
const deleteFile = async (req, res) => {
    const { id } = req.params;
    try {
        const file = await File.findByIdAndDelete(id);
        if (!file) {
            return res.status(404).json({ error: "File not found" });
        }
        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createFile,
    getFile,
    updateFile,
    deleteFile
};