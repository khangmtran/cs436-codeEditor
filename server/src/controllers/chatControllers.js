const Chat = require('../models/chat');
const Project = require('../models/project');

// Get all chats for a project
const getChat = async (req, res) => {
  try {
    const { projectId } = req.params;
    const chats = await Chat.find({ projectId }).populate('userId', 'fname lname');
    res.status(200).json({ chats: chats || [] }); // Return an empty array if no chats are found
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a message to a chat
const addMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { user, text, type } = req.body;
    console.log(`Adding message to project: ${projectId}`);

    const newMessage = new Chat({
      projectId,
      userId: req.user._id, // Assuming you have user authentication and req.user is available
      userName: user,
      message: text,
      type,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getChat,
  addMessage,
};