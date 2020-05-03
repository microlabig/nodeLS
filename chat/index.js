const SOCKET_PORT = (parseInt(process.env.PORT) + 30).toString(); // порт сокет соединения = (default + 30)
const io = require('socket.io').listen(SOCKET_PORT);

const users = {};
const messages = {};

module.exports = () => {
  console.log(`Socket-сервер запущен на порту ${SOCKET_PORT}`);

  io.sockets.on('connection', (socket) => {
    const socketId = socket.id;

    socket.on('users:connect', ({ userId, username }) => {
      console.log(`${username} c id:${userId} подключился в чат`);
      users[socketId] = {
        username, // : `#${username}`,
        socketId, // : `#${socketId}`,
        userId, // : `#${userID}`,
        activeRoom: null
      };
      socket.emit('users:list', Object.values(users));
      socket.broadcast.emit('users:add', users[socketId]);
      messages[userId] = [];
    });

    socket.on('message:add', ({ senderId, recipientId, roomId, text }) => {
      console.log('\nmessage:add', { senderId, recipientId, roomId, text });
      messages[senderId].push({ recipientId, text });
      if (users[roomId]) {
        socket.in(roomId).emit('message:add', {
          recipientId,
          senderId,
          text
        });
      }
    });

    socket.on('message:history', ({ recipientId, userId }) => {
      const messagesList = [];
      console.log('\nmessage:history', { recipientId, userId });

      for (const obj in messages) {
        messagesList.push(messages[obj].text);
      }

      if (users[socketId]) {
        console.log('Список сообщений: ', messagesList);

        socket.in(socketId).emit('message:history', messagesList);
      }
    });

    socket.on('disconnect', () => {
      if (users[socketId]) {
        socket.broadcast.emit('users:leave', socketId);
        delete users[socketId];
        delete messages[socketId];
      }
    });
  });
};
