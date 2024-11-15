const Folder = require('../models/folder.js');
const File = require('../models/file.js');

// POST Create a Folder
const createFolder = async (req, res) => {
    const { name, parentFolder, project } = req.body;
    try {
        const folder = await Folder.create({ name, parentFolder, project });
        res.status(200).json(folder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET Retrieve a Folder by ID
const getFolder = async (req, res) => {
    const { id } = req.params;
    try {
        const folder = await Folder.findById(id).populate('files subfolders');
        if (!folder) {
            return res.status(404).json({ error: "Folder not found" });
        }
        res.status(200).json(folder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT Update a Folder
const updateFolder = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const folder = await Folder.findByIdAndUpdate(id, updates, { new: true });
        if (!folder) {
            return res.status(404).json({ error: "Folder not found" });
        }
        res.status(200).json(folder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE Delete a Folder
const deleteFolder = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete associated files
        await File.deleteMany({ parentFolder: id });
        
        // Delete folder itself
        const folder = await Folder.findByIdAndDelete(id);
        if (!folder) {
            return res.status(404).json({ error: "Folder not found" });
        }
        res.status(200).json({ message: "Folder and its files deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createFolder,
    getFolder,
    updateFolder,
    deleteFolder,
};
