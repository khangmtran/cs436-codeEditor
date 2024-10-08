const express = require('express')
const router = express.Router()
const {
    createUser,
    loginUser
} = require('../controllers/authControllers.js')

// make user
router.post('/register', createUser)

// login user 
router.post('/login', loginUser)

module.exports = router