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

// List all files in a specific folder
folderSchema.statics.listFilesInFolder = async function(folderId) {
  const Folder = this;
  const folder = await Folder.findById(folderId).populate('files');
  return folder ? folder.files : [];
};

// Move file between folders
folderSchema.statics.moveFileToFolder = async function(fileId, newFolderId) {
  const Folder = this;
  const newFolder = await Folder.findById(newFolderId);
  if (newFolder) {
      await File.findByIdAndUpdate(fileId, { parentFolder: newFolderId });
      return true;
  }
  return false;
};

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;
