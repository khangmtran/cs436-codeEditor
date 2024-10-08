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

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
