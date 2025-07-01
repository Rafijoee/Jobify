const { userValidation } = require("../validators/user");
const  User  = require("../models/user");

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
};
