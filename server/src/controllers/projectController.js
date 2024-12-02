const Project = require('../models/project.js');
const Folder = require('../models/folder.js');
const File = require('../models/file.js');
const User = require('../models/user.js');
const Chat = require('../models/chat.js');


// POST Create a Project
const createProject = async (req, res) => {
    const { name, description} = req.body;
    const owner = req.user._id;
    try {
        const project = await Project.create({ name, description, owner });

        await User.findByIdAndUpdate(owner, { $push: { projectIDs: project._id } });
        console.log("project created and added")
        res.status(200).json(project);
    } catch (error) {
        console.log(error.message)
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

// Fetch all files for a project
const getProjectFiles = async (req, res) => {
    console.log("get project files hit in project controller")
    try {
      const { projectId } = req.params;
      const files = await File.find({ project: projectId });
      if (!files) return res.status(404).json({ error: "No files found for this project" });
    console.log(files)
      res.status(200).json(files);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

const addCollaborator = async (req, res) => {
    const { projectId } = req.params;
    const { email } = req.body;

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const user = await User.findOne({ email }).select('_id projectIDs');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const project = await Project.findById(projectId).select('collaborators');
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        console.log(user)
        // Add the project to the user's projects if not already added
        if (!user.projectIDs.includes(projectId)) {
            user.projectIDs.push(projectId);
            await user.save();
        }

        // Add the user to the project's collaborators if not already added
        if (!project.collaborators.includes(user._id)) {
            project.collaborators.push(user._id);
            await project.save();
        }

        res.status(200).json({ message: "User added as collaborator successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createProject,
    getProject,
    updateProject,
    deleteProject,
    getProjectFiles,
    addCollaborator,
};
