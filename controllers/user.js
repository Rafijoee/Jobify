const User = require("../models/user");
const { get } = require("../routes");

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
      
};
