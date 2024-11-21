const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure consistent casing

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'adlerkhangfemorjaydencsc'); // Replace with your actual secret
    console.log("decode : " + decoded.userId)
    user = await User.findById(decoded.userId);
    if (!user) {
      console.log("usernotefound")
      return res.status(401).json({ message: 'User not found' });
    }
    console.log(' user authenticated')
    req.user = user; // Set the entire user object to req.user
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authenticate;