
const express = require('express')
const http = require('http');
const app = express()
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
const dotenv = require('dotenv')
dotenv.config();
const port = process.env.PORT || 3000;




server.listen(port, ()=>{
  console.log( `listening on port: ${port}`);
});
