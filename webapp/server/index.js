import express from 'express';
import router from './routes.js';
import morgan from 'morgan';
import socketIO from 'socket.io';
import http from 'http';
import * as poetryOutput from './poetry/poetryOutput.js';

let app = express();
let server = http.createServer(app);
let io = socketIO(server, { rememberTransport: false, transports: ['websocket'] });

//logger
app.use(morgan('combined'));

//static files
app.use(express.static('public/'))

io.on('connection', (socket) => {
  socket.on('poemcall', (data) => {
    poetryOutput.streamPoem(data, socket);
  })
});

//api
app.use(router);

server.listen(3000, () =>
  console.log('app listening on port 3000!'),
);