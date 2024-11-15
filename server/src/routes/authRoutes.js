// Imports
const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/authControllers.js')

// Functionality
router.post('/signup', (req, res, next) => {
    console.log("Signup route hit");
    next();
}, authControllers.createUser);
router.post('/login', authControllers.loginUser)

// Export
module.exports = router