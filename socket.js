const { Server } = require('socket.io');
const socketAuth = require('./utils/socketAuth');

const socketInit = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log('User connected:', socket.user.email);

    socket.on('private_message', ({ to, message }) => {
      // Kirim ke socket ID tertentu
      io.to(to).emit('private_message', {
        from: socket.id,
        message,
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user.email);
    });
  });
};

module.exports = socketInit;
