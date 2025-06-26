// src/controllers/auth.js
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prismaClient');
const { sendOtpEmail } = require('../utils/emailHelper');
const { signToken } = require('../utils/jwtHelper');
const passport = require('passport');
const crypto = require('crypto');

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit string
};

// ====== POST /api/auth/register ======
exports.register = async (req, res) => {
  // Validasi input (gunakan express-validator di route)
  console.log(require('express-validator'));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Cek apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate OTP & expiration (10 menit dari sekarang)
    const otpCode = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Simpan user dengan field OTP
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isVerified: false,
        otpCode,
        otpExpires,
      },
    });

    // Kirim email OTP
    await sendOtpEmail(email, otpCode);

    res.status(201).json({
      message: 'Registrasi berhasil. Cek email untuk OTP verifikasi.',
      userId: newUser.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ====== POST /api/auth/verify-otp ======
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email dan OTP dibutuhkan.' });
  }

  try {
    // Cari user berdasarkan email & otpCode
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User tidak ditemukan.' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Akun sudah terverifikasi.' });
    }
    if (user.otpCode !== otp) {
      return res.status(400).json({ message: 'OTP tidak valid.' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP sudah kadaluarsa.' });
    }

    // Update isVerified dan bersihkan OTP
    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpires: null,
      },
    });

    res.json({ message: 'Verifikasi berhasil. Silakan login.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ====== POST /api/auth/login ======
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Cari user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Akun belum diverifikasi.' });
    }
    if (!user.password) {
      return res.status(400).json({ message: 'Akun ini hanya bisa login via Google.' });
    }

    // Bandingkan password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    // Buat JWT
    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ====== GET /api/auth/google/callback ======
// Fungsi ini di‐trigger setelah Passport berhasil autentikasi
exports.googleCallback = (req, res) => {
  // req.user sudah di‐isi oleh Passport (user dari DB)
  const user = req.user;
  // Buat JWT untuk user
  const token = signToken({ id: user.id, email: user.email });
  // Redirect ke front-end (React) dengan membawa token
  return res.redirect(`${process.env.BASE_URL}/api/?token=${token}`);
};

// ====== GET /api/auth/google-login ======
// Fungsi ini diarahkan ke Passport untuk redirect ke Google
exports.googleLogin = (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })(req, res, next);
};
