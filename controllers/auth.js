// src/controllers/auth.js
const bcrypt = require('bcrypt');
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

  const { email, password, name } = req.body;

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
    const newUser = await prisma.$transaction(async (tx) => {
      // Simpan user
      const createdUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          isVerified: false,
          otpCode,
          otpExpires,
        },
      });

      await sendOtpEmail(email, otpCode);

      res.status(201).json({
        message: 'Registrasi berhasil. Cek email untuk OTP verifikasi.',
        userId: createdUser.id,
      });
      return createdUser;
    });

    res.status(201).json({
      message: 'Registrasi berhasil. Cek email untuk OTP verifikasi.',
      userId: newUser.id,
      otpCode: otpCode, // Hanya untuk testing, jangan kirim ke client di production
    });
  } catch (err) {
    console.error(err, 'ini errornya di controller auth.js');
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
// ====== POST /api/auth/resend-otp ======

exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
  if (!email) {
    return res.status(400).json({ message: 'Email dibutuhkan.' });
  }
  const otpCode = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  const newUser = await prisma.$transaction(async (tx) => {
    // Simpan user
    const createdUser = await tx.user.update({
      where: { email },
      data: {
        otpCode,
        otpExpires,
      },
    });

    // Kirim email — jika gagal, akan throw error dan rollback user create
    const test = await sendOtpEmail(email, otpCode);
    console.log(test, 'ini test email');
    return createdUser;
  });
  res.status(200).json({
    message: 'OTP baru telah dikirim ke email Anda.',
    userId: newUser.id,
    otpCode: otpCode, // Hanya untuk testing, jangan kirim ke client di production
  });
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
}

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

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }

    const token = signToken({ id: user.id, email: user.email, role : user.role });
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
  const token = signToken({ id: user.id, email: user.email, role : user.role });
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

