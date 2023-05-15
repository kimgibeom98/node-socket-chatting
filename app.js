const express = require('express')
const socket = require('socket.io')
const http = require('http')
const fs = require('fs')
const app = express()
const server = http.createServer(app)
const io = socket(server)
let peCount = 0;

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/', function (request, response) {
  fs.readFile('./static/index.html', function (err, data) {
    if (err) {
      response.send('에러')
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html' })
      response.write(data)
      response.end()
    };
  });
})

io.sockets.on('connection', function (socket) {
  socket.on('newUser', function (name) {
    peCount = peCount + 1;
    socket.name = name;
    io.sockets.emit('update', { type: 'connect', count: peCount, name: '관리자', message: name + '님이 접속하였습니다.' });
  })

  socket.on('message', function (data) {
    data.name = socket.name;
    data.count = peCount;
    socket.broadcast.emit('update', data);
  })

  socket.on('disconnect', function () {
    peCount = peCount - 1;
    console.log(socket.name + '님이 나가셨습니다.');
    socket.broadcast.emit('update', { type: 'disconnect', count: peCount, name: '관리자', message: socket.name + '님이 나가셨습니다.' });
  })
})

server.listen(8080, function () {
  console.log('서버 실행!')
})
