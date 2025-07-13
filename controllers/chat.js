const http = require('http');
const socketIo = require('socket.io');

// Membuat server HTTP
const server = http.createServer();

// Inisialisasi Socket.IO
const io = socketIo(server, {
    cors: {
        origin: '*', // Atur sesuai kebutuhan
        methods: ['GET', 'POST']
    }
});

// Event ketika client terhubung
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Contoh menerima pesan dari client
    socket.on('chatMessage', (msg) => {
        console.log('Received message:', msg);
        // Kirim pesan ke semua client
        io.emit('chatMessage', msg);
    });

    // Event ketika client disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Jalankan server pada port 3000
server.listen(3000, () => {
    console.log('Socket server running on port 3000');
});
