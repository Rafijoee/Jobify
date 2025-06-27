if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport'); // <= import dulu

require('./utils/passport'); // <= wajib load strategi Passport

const router = require('./routes/index');

const app = express(); // <= HARUS sebelum app.use()

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize()); // <= HARUS setelah app dibuat

// Routes
app.use('/api/', router);


// Start server
const server = app.listen(PORT, () => {
    const serverUrl = `http://localhost:${PORT}`;
    console.log(`Server berjalan di: ${serverUrl}/api/`);
});
