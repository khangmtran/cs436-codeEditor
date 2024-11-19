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

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server });

// Middleware
app.use(express.json())
app.use(cors())

// Request Logging Middleware
app.use((req,res,next) =>{
  console.log(req.path,req.params)
  next()
})

// Mount routes
app.use('/api/auth',authRoutes)
app.use('/api/file',fileRoutes)
app.use('/api/folder', folderRoutes);
app.use('/api/project', projectRoutes);
console.log('File routes mounted at /api/file');
console.log('Folder routes mounted at /api/folder');
console.log('Project routes mounted at /api/project');

// Placeholder Code for running, will be replaces with a code Routes or something
app.post('/run', async (req, res) => {
    res.json({ output: 'Hello from the code execution endpoint!' });
  });

// Create a WebSocket server attached to the HTTP server
wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});
console.log('connected to wss')

// Start Server
const PORT = process.env.PORT || 4000;
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});