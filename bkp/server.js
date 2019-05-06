const express = require('express');
const five = require('johnny-five');
const arduino = require('./arduino');
const classRoom = require('./classroom')
const app = express();

const server = app.listen(process.env.PORT || 4000, function() {
  let port = process.env.PORT || 4000;
  console.log('Socket server listening at: ' + port);
});

// const board = new five.Board();
// board.on("ready", () => {
//   const io = require('socket.io')(server);
//
//   io.on('connection', function(socket){
//     classRoom.initialize(io, socket);
//     arduino.initialize(socket, five);
//   });
// });
const io = require('socket.io')(server);
io.on('connection', function(socket){
  classRoom.initialize(io, socket);
  // arduino.initialize(socket, five);
});
