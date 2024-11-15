const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  rootFolders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Folder',
    default: [],
  },
  rootFiles: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'File',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


// Middleware to update the `updatedAt` field on each save
projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


// List all root files in a project (files that are not in any folder)
projectSchema.statics.listRootFiles = async function(projectId) {
  const Project = this;
  const project = await Project.findById(projectId).populate('rootFiles');
  return project ? project.rootFiles : [];
};


const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
