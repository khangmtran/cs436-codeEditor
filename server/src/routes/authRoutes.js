// Imports
const express = require('express')
const router = express.Router()
const authControllers = require('../controllers/authControllers.js')
const authenticate = require('../middleware/authenticate.js')

// Functionality
router.post('/signup', (req, res, next) => {
    console.log("Signup route hit");
    next();
}, authControllers.createUser);
router.post('/login', authControllers.loginUser)
router.get('/projects', authenticate, authControllers.getUserProjects);

// Export
module.exports = router