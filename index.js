require('dotenv').config({path: './config/config.env'})
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
	pingTimeout: 30000,
	cors: {
		origin: '*',
	}
});
exports.socketIO = io;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

app.get('/', (req, res) => {
    res.send('Welcome to Chaotic Chronicles Epic Final Socket Service')
})

server.listen(port, () => {
  	console.log(`Server activo en ${port}`);
});

require('./socket/socketMain');
