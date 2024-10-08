const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  projectIDs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Project',
    default: [],
  }
}, {
  timestamps: true, 
});

userSchema.statics.signup = async function (firstName, lastName, email, password) {
  const exist = await this.findOne({ email });
  
  if (exist) {
    throw Error('Email already in use');
  }

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hash,
  });

  return user;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
