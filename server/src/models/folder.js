const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  subfolders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Folder',
    default: [],
  },
  files: {
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

folderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;
