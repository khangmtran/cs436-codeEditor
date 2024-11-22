const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure consistent casing
// Function to create JWT token
const createToken = (userId) => {
  return jwt.sign({ userId }, 'adlerkhangfemorjaydencsc', { expiresIn: '1h' }); // Replace with your actual secret
};

// POST Create a User
const createUser =  async (req, res) => {
    const {fname, lname, email, password} = req.body
    try{
        const user = await User.signup(fname,lname,email,password)
        const token = createToken(user._id)
        res.status(200)
        res.json({email,token})
    }
    catch(error){
        res.status(400).json({error : error.message})
    }
}

// POST Login a User
const loginUser = async (req, res) =>{
    const {email, password} = req.body
    try{
        const user = await User.login(email,password)
        const token = createToken(user._id)
        res.status(200)
        res.json({email,token})
    }
    catch(error){
        res.status(400).json({error: error.message})
    }
}
const getUserProjects = async (req, res) => {
  try {
    console.log("getting all projects")
    const userId = req.user._id; // Use req.user._id instead of req.user.id
    const user = await User.findById(userId).populate('projectIDs');
    if (!user) {
      console.log('User not found in getUserProjects');
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.projectIDs);
  } catch (error) {
    console.error('Error in getUserProjects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUserProjects
};