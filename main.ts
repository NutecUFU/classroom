import * as express from 'express';
import { Classroom } from './classroom';

const app = express();
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Classroom server listening at: ${port}`);
});
const io = require('socket.io')(server)

io.on('connection', (socket: any) => {
  
  const classroom = new Classroom();
  classroom.initialize(io, socket);
})
