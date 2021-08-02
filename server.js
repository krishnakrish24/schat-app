const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');
const formatmsg = require('./utils/msgs');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname, 'public' )));

const botname = "SChat Bot";

io.on('connection', socket => {
    socket.on('joinroom', ({username,room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
    
        socket.emit('message', formatmsg(botname,'Welcome to SChat!'));

        socket.broadcast.to(user.room).emit('message', formatmsg(botname,`${user.username} has joined the chat!`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });

    //Listen for Chat Messages
    socket.on('chatmsg', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatmsg(user.username, msg));
    });

    //User disconnected
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
          io.to(user.room).emit(
            'message',
            formatmsg("SChat Bot", `${user.username} has left the chat`)
          );
    
          // Send users and room info
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        }
      });
});

server.listen(3000, () => console.log("Server Running on port 3000!"))