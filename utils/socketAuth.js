const { verifyToken } = require('../utils/jwtHelper');

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('Token tidak ditemukan'));
  }

  const user = verifyToken(token);
  if (!user) {
    return next(new Error('Token tidak valid'));
  }

  socket.user = user;
  next();
};

module.exports = socketAuth;
