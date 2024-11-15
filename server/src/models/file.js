const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    required: true, 
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,  // Mongoose.Shchema.Types.ObjectId
    ref: 'Folder',
    default: null,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,  // Mongoose.Shchema.Types.ObjectId
    ref: 'Project',
    required: true,
  },
  version: {
    type: Number,
    default: 1,
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


fileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


// File-specific CRUD Operations
fileSchema.statics.createFile = async function({ name, content, type, parentFolder, project }) {
  return this.create({ name, content, type, parentFolder, project });
};

fileSchema.statics.findFileById = async function(id) {
  return this.findById(id);
};

fileSchema.statics.updateFileById = async function(id, updates) {
  return this.findByIdAndUpdate(id, updates, { new: true });
};

fileSchema.statics.deleteFileById = async function(id) {
  return this.findByIdAndDelete(id);
};


const File = mongoose.model('File', fileSchema);
module.exports = File;
