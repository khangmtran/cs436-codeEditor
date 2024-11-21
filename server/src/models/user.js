const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const validator = require('validator')

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
  
  if(!email || !password || !firstName || !lastName){
    throw Error("All fields must be filled out")
  }
  if(!validator.isEmail(email)){
    throw Error("Enter is not valid")
  }
  if(!validator.isStrongPassword(password)){
    throw Error("Password is not valid")
  }
  
  
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

userSchema.statics.login = async function (email, password){
  if(!email || !password){
    throw Error("All fields must be filled out")
  }
  const user = await this.findOne({email})
  if(!user){
    throw Error("Email does not exist");
  }
  const match = await bcrypt.compare(password, user.password)
  if(!match){
    throw Error("Incorrect password")
  }
  return user
}

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
