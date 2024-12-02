const mongoose = require('mongoose');
const WebSocket = require('ws');
const Chat = require('./src/models/chat');
const File = require('./src/models/file');

// Map to store project-wise WebSocket connections
const projectClients = new Map();

// Helper: Broadcast to specific project
const broadcastToProject = (projectId, message) => {
    const clients = projectClients.get(projectId) || new Set();
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

// Handle Chat Messages
const handleChatMessage = async (data, ws) => {
    try {
        const projectId = new mongoose.Types.ObjectId(data.projectId);

        const chatMessage = await Chat.create({
            projectId,
            senderId: data.senderId,
            content: data.content,
        });

        console.log('Chat message saved:', chatMessage);

        broadcastToProject(
            projectId.toString(),
            JSON.stringify({
                event: 'chat-message',
                data: chatMessage,
            })
        );
    } catch (error) {
        console.error('Error handling chat message:', error.message);
        ws.send(JSON.stringify({ event: 'error', message: 'Failed to handle chat message' }));
    }
};

// Handle File Updates
const handleFileUpdate = async (data, ws) => {
    const { fileId, content, projectId } = data;

    try {
        const file = await File.findByIdAndUpdate(fileId, { content }, { new: true });
        if (file) {
            broadcastToProject(
                projectId,
                JSON.stringify({
                    event: 'file-update',
                    data: { fileId, content },
                })
            );
        }
    } catch (error) {
        console.error('Error handling file update:', error.message);
        ws.send(JSON.stringify({ event: 'error', message: 'Failed to update file' }));
    }
};

// Handle Project Updates
const handleProjectUpdate = async (data, ws) => {
    const { projectId, update } = data;

    try {
        broadcastToProject(
            projectId,
            JSON.stringify({
                event: 'project-update',
                data: update,
            })
        );
    } catch (error) {
        console.error('Error handling project update:', error.message);
        ws.send(JSON.stringify({ event: 'error', message: 'Failed to update project' }));
    }
};

// Add a new WebSocket connection to a project
const addClientToProject = (projectId, ws) => {
    if (!projectClients.has(projectId)) {
        projectClients.set(projectId, new Set());
    }
    projectClients.get(projectId).add(ws);

    // Cleanup on close
    ws.on('close', () => {
        projectClients.get(projectId)?.delete(ws);
        if (projectClients.get(projectId)?.size === 0) {
            projectClients.delete(projectId);
        }
    });
};

module.exports = {
    handleChatMessage,
    handleFileUpdate,
    handleProjectUpdate,
    addClientToProject,
};
