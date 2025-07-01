const ImageKit = require("imagekit");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const imagekit = require("../utils/imageKit");
const { uploadAvatar } = require("../utils/uploads/avatar");

class User {
  static async changeProfile(id, file) {
    try {
      let avatar = null;
      if (!file) {
        throw new Error("Avatar wajib diisi.", 400);
      }
      if (file) {
        const uploadImageKit = await imagekit.upload({
          file: file.buffer.toString("base64"),
          fileName: file.originalname,
          folder: "Foto-Profile",
        });
        avatar = uploadImageKit.url;
      }
      const updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          photoUrl: avatar,
        },
      });
      return updatedUser;
    } catch (error) {
      console.log(error, "ini error di model");
      throw new Error("Gagal mengubah foto profil.", 500);
    }
  }

  static async changePassword(id, {oldPassword, newPassword} ) {
    try {
      if (oldPassword === newPassword) {
        throw new Error("Kata sandi baru tidak boleh sama dengan kata sandi lama.", 400);
      }
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        throw new Error("Password lama yang Anda masukkan salah.", 401);
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          password: hashedPassword,
        },
      });
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error("Gagal mengubah kata sandi.", 500);
    }
  }
  static async deleted(id) {
    try {
      const user = await prisma.user.delete({
        where: {
          id: id,
        },
      });
      return user;
    } catch (error) {
      throw new Error("Gagal menghapus user.", 500);
    }
  }
  static async getAll(skip, limit) {
    return await prisma.user.findMany({
        skip,
        take: limit,
      });
    }
    static async countAll() {
      return await prisma.user.count();
    }
  static async getProfile(id) {
    try {
      return await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new Error("Gagal mendapatkan profil.", 500);
    }
  }
  static async findByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
    } catch (error) {
      throw new Error("Gagal menemukan user dengan email tersebut.", 500);
    }
  }
}

module.exports = User;
