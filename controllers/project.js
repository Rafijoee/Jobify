const validations = require("../validations/project");
const Project = require("../models/project");

module.exports = {
  getAll: async (req, res) => {
    try {
      const data = await Project.getAll();
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Data semua project berhasil didapatkan.",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mengambil data project. Silakan coba lagi.",
      });
    }
  },
  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Project.getById(id);
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Data project berhasil didapatkan.",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mengambil data project. Silakan coba lagi.",
      });
    }
  },
  getByUser: async (req, res) => {
    try {
      const userId = req.user.id;
      const data = await Project.getByUser(userId);
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Data project berhasil didapatkan.",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mengambil data project. Silakan coba lagi.",
      });
    }
  },
  create: async (req, res) => {
    try {
      await validations.create(req.body);
      const data = await Project.create(req.body);
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Project berhasil dibuat.",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat membuat project. Silakan coba lagi.",
      });
    }
  },
  update: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);
      const data = await Project.update(id, req.body);
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Project berhasil diupdate.",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat update project. Silakan coba lagi.",
      });
    }
  },
  delete: async (req, res) => {
    try {
        const id = req.params.id;
        await Project.delete(id);
        return res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Project berhasil dihapus.",
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat menghapus project. Silakan coba lagi.",
      });
    }
  },
};
