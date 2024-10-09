const express = require('express')
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils');
const cors = require('cors');
const http = require('http'); // Import the http module

//Routes
const authRoutes = require('./src/routes/authRoutes.js')

const app = express()

const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())
// log to the server any requests
app.use((req,res,next) =>{
    console.log(req.path,req.params)
    next()
})
//mount routes
app.use('/api/authRoutes',authRoutes)

// Placeholder Code for running, will be replaces with a code Routes or something
app.post('/run', async (req, res) => {
    res.json({ output: 'Hello from the code execution endpoint!' });
  });


const server = http.createServer(app);

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });
 wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});
console.log('conneceted to wss')
// Connect to MongoDB and start the server
mongoose.connect("mongodb+srv://root:R5O4lPtZsjhGczBC@collabcodeeditor.z5wf5.mongodb.net/")
  .then(() => {
    server.listen(4000, () => {
      console.log('HTTP and WebSocket server running on http://localhost:4000');
    });
  })
  .catch((error) => {
    console.log(error);
  });
