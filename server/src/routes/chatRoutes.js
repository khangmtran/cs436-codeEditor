const express = require('express');
const router = express.Router();
const { getChat, createChat, addMessage } = require('../controllers/chatControllers');
const authenticate = require('../middleware/authenticate');

// Get the chat for a project
router.get('/:projectId', authenticate, getChat);

// Create a chat for a project (if it doesn't already exist)
router.post('/:projectId', authenticate, createChat);

// Add a message to a chat
router.post('/:projectId/message', authenticate, addMessage);

module.exports = router;