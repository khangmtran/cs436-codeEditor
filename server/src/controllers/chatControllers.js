const Chat = require('../models/chat');
const Project = require('../models/project');

// Get all chats for a project
const getChats = async (req, res) => {
  try {
    const { projectId } = req.params;
    const chats = await Chat.find({ projectId }).populate('messages.sender', 'fname lname email');
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new chat for a project
const createChat = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const chat = new Chat({ projectId });
    await chat.save();

    project.chatIDs.push(chat._id);
    await project.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a message to a chat
const addMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = {
      sender: userId,
      content,
      timestamp: new Date(),
    };

    chat.messages.push(message);
    await chat.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getChats,
  createChat,
  addMessage,
};