// Imports
require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const connectDB = require('./src/utils/database'); // Import DB connection
const authRoutes = require('./src/routes/authRoutes.js');
const fileRoutes = require('./src/routes/fileRoutes.js');
const folderRoutes = require('./src/routes/folderRoutes.js');
const projectRoutes = require('./src/routes/projectRoutes.js');
const chatRoutes = require('./src/routes/chatRoutes.js');

const app = express();
const server = http.createServer(app); // Create an HTTP server
const wss = new WebSocket.Server({ server }); // Attach WebSocket server to HTTP server

const projectClients = new Map(); // Map to track WebSocket clients by projectId

// Middleware
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173', // Specify the frontend's origin
  credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(req.path, req.params);
  next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/folder', folderRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/chat', chatRoutes);
console.log('Routes mounted successfully');

// Placeholder code execution route
app.post('/run', async (req, res) => {
  res.json({ output: 'Hello from the code execution endpoint!' });
});

// Helper function to broadcast messages to all clients in a specific project
const broadcastToProject = (projectId, message) => {
  const clients = projectClients.get(projectId) || new Set();
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// WebSocket server logic
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  // Handle incoming messages
  ws.on('message', async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log(`[WebSocket] Raw message received: ${message}`);

      switch (parsedMessage.event) {
        case 'chat-message':
          // Handle chat messages (not implemented here)
          console.log(`[WebSocket] Chat message received: ${parsedMessage.data}`);
          break;

        case 'file-update':
          const { projectId, updatedContent } = parsedMessage.data;
          // Broadcast file update to all clients in the project
          broadcastToProject(projectId, JSON.stringify({
            event: 'file-update',
            data: { updatedContent },
          }));
          break;

        case 'join-project':
          const { projectId: joinProjectId } = parsedMessage.data;
          ws.projectId = joinProjectId;

          // Add client to the project's client set
          if (!projectClients.has(joinProjectId)) {
            projectClients.set(joinProjectId, new Set());
          }
          projectClients.get(joinProjectId).add(ws);

          console.log(`[WebSocket] Client joined project ${ws.projectId}`);
          break;

        default:
          console.log(`[WebSocket] Unknown event received: ${parsedMessage.event}`);
      }
    } catch (error) {
      console.error(`[WebSocket] Error handling message: ${error.message}`);
    }
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('WebSocket connection closed');
    if (ws.projectId && projectClients.has(ws.projectId)) {
      projectClients.get(ws.projectId).delete(ws);
      if (projectClients.get(ws.projectId).size === 0) {
        projectClients.delete(ws.projectId);
      }
    }
  });

  // Handle connection errors
  ws.on('error', (error) => {
    console.error(`[WebSocket] Connection error: ${error.message}`);
  });
});
console.log('WebSocket server is running');

// Start Server
const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
