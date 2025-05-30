const validations = require("../validations/task");
const Task = require("../models/task");
const { update } = require("../models/task");

module.exports = {
  getAll: async (req, res) => {
    try {
      const data = await Task.getAll();
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Data semua task berhasil didapatkan.",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mengambil data task. Silakan coba lagi.",
      });
    }
  },
  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await Task.getById(id);
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Data task berhasil didapatkan.",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mengambil data task. Silakan coba lagi.",
      });
    }
  },
  getByUser: async (req, res) => {
    try {
      const user = req.user;
      const data = await Task.getByUser(user.id);
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Data task berhasil didapatkan.",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mengambil data task. Silakan coba lagi.",
      });
    }
  },
  create: async (req, res) => {
    try {
      const data = req.body;
      const projectId = req.params.id;
      await validations.create(data, projectId);
      const task = await Task.create(data, projectId);
      return res.status(201).json({
        status: "Success",
        statusCode: 201,
        message: "Task berhasil dibuat.",
        data: task,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat membuat task. Silakan coba lagi.",
      });
    }
  },
  updateStatus: async (req, res) => {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      const data = req.body;
      const task = await Task.updateStatus(userId, id, data);
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Status task berhasil diubah.",
        data: task,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mengubah status task. Silakan coba lagi.",
      });
    }
  },
  update : async (req, res) => {
    try {
      const id = req.params.id;
      const data = req.body;
      await validations.update(data);
      const task = await Task.update(id, data);
      return res.status(200).json({
        status: "Success",
        statusCode: 200,
        message: "Task berhasil diubah.",
        data: task,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat mengubah task. Silakan coba lagi.",
      });
    }
  },
  delete : async (req, res) => {
    try{
        const id = req.params.id;
        await Task.delete(id);
        return res.status(200).json({
          status: "Success",
          statusCode: 200,
          message: "Task berhasil dihapus.",
        });

    }catch(err){
      console.log(err);
      return res.status(500).json({
        status: "Failed",
        statusCode: 500,
        message: "Terjadi kesalahan saat menghapus task. Silakan coba lagi.",
      });
    }
  }
};
