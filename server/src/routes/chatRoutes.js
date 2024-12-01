const express = require('express');
const router = express.Router();
const { getChat, addMessage } = require('../controllers/chatControllers');
const authenticate = require('../middleware/authenticate');

// Get the chat for a project
router.get('/:projectId', authenticate, getChat);

// Add a message to a chat
router.post('/message/:projectId', authenticate, addMessage);

module.exports = router;