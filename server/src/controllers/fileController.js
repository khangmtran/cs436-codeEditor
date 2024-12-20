const File = require('../models/file.js')
const Folder = require('../models/folder.js')
const Project = require('../models/project.js')


// POST Create a File
const createFile = async (req, res) => {
    const { projectId } = req.params;
    const { name, content, type, parentFolder } = req.body;
  
    try {
      // Ensure the project exists
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ error: 'Project not found' });
  
      const file = await File.createFile({
        name,
        content,
        type,
        parentFolder,
        project: projectId,
      });
      res.status(201).json(file);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
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
const renameFile = async (req, res) => {  const { id, newName } = req.params;
console.log(`changeing ${id} to ${newName}`);
try {
    const file = await File.findByIdAndUpdate(id, { name: newName }, { new: true });
    if (!file) {
        return res.status(404).json({ error: "File not found" });
    }
    res.status(200).json(file);
} catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
}
 
};



module.exports = {
    createFile,
    getFile,
    updateFile,
    deleteFile,
    renameFile,
};