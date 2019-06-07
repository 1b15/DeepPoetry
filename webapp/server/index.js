import express from 'express';
import router from './routes.js';
import morgan from 'morgan';
const socketIO = require('socket.io');
import http from 'http';
import * as poetryModel from './poetry/poetryModel.js';

let app = express();
let server = http.createServer(app);
let io = socketIO(server, { rememberTransport: false, transports: ['websocket'] });
poetryModel.init()

//logger
app.use(morgan('combined'));

//static files
app.use(express.static('public/'))

io.on('connection', (socket) => {
  socket.on('poemcall', (data) => {
  //TODO DATA VALIDATION
  poetryModel.streamPoem(data, socket);
  })
});

//api
app.use(router);

server.listen(3000, () =>
  console.log('app listening on port 3000!'),
);