const User = require("../models/user");
const { sendOtpEmail } = require("../utils/emailHelper");
const prisma = require('../utils/prismaClient');
const bcrypt = require('bcrypt');


module.exports = {
  changeProfile: async (req, res, next) => {
    try {
      const data = await User.changeProfile(req.user.id, req.file);
      return res.status(201).json({
        status: "Success",
        statusCode: 200,
        message: "Profil berhasil diubah.",
        data: data,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mengubah profil. Silakan coba lagi.",
      });
    }
  },
  changePassword: async (req, res, next) => {
    try {
      const data = await User.changePassword(req.user.id, req.body);
      return res.status(201).json({
        status: "Success",
        statusCode: 200,
        message: "Kata sandi berhasil diubah.",
        data: data,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message:
          "Terjadi kesalahan saat mengubah kata sandi. Silakan coba lagi.",
      });
    }
  },
  getProfile: async (req, res, next) => {
    try {
      const data = await User.getProfile(req.user.id);
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Berhasil mendapatkan profil.",
        data: data,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message:
          "Terjadi kesalahan saat mendapatkan profil. Silakan coba lagi.",
      });
    }
  },
  getAllUsers: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        User.getAll(skip, limit),
        User.countAll(),
      ]);
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Data semua user berhasil didapatkan.",
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message:
          "Terjadi kesalahan saat mendapatkan data user. Silakan coba lagi.",
      });
    }
  },
  getUserById: async (req, res, next) => {
    try {
      const userId = req.params.id;
      const data = await User.getProfile(userId);
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Berhasil mendapatkan user.",
        data: data,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mendapatkan user. Silakan coba lagi.",
      });
    }
  },
  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          status: "Failed",
          statusCode: 404,
          message: "User tidak ditemukan.",
        });
      }
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      const newUser = await prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.update({
          where: { email },
          data: {
            otpCode,
            otpExpires,
          },
        });

        await sendOtpEmail(email, otpCode);
        res.status(201).json({
          status: "Success",
          statusCode: 201,
          message: "OTP berhasil dikirim ke email Anda.",
          data: {
            email: createdUser.email,
          },
        });
        return createdUser;
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mengirim OTP. Silakan coba lagi.",
      });
    }
  },
  verifyResetOtp: async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ message: 'Email dan OTP dibutuhkan.' });
      }
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          status: "Failed",
          statusCode: 404,
          message: "User tidak ditemukan.",
        });
      }
      if (user.otpCode !== otp) {
        return res.status(400).json({
          status: "Failed",
          statusCode: 400,
          message: "OTP tidak valid.",
        });
      }
      if (user.otpExpires < new Date()) {
        return res.status(400).json({
          status: "Failed",
          statusCode: 400,
          message: "OTP sudah kadaluarsa.",
        });
      }
      await prisma.user.update({
        where: { email },
        data: { canResetPassword: true }, 
      });
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Verifikasi OTP berhasil. Silakan reset password.",
      });
    }catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat memverifikasi OTP. Silakan coba lagi.",
      });
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email dan password baru dibutuhkan.' });
      }
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          status: "Failed",
          statusCode: 404,
          message: "User tidak ditemukan.",
        });
      }
      if (!user.canResetPassword) {
        return res.status(400).json({
          status: "Failed",
          statusCode: 400,
          message: "Anda tidak dapat mereset password saat ini.",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          canResetPassword: false, // Reset status setelah reset password
        },
      });
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Password berhasil direset. Silakan login dengan password baru.",
        data: {
          email,
        },
      });
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mereset password. Silakan coba lagi.",
      });
    }
  }
};
