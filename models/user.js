const ImageKit = require("imagekit");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const imagekit = require("../utils/imageKit");

class User {
  static async changeProfile(id, file) {
    try {
      let avatar = null;
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
          avatar: avatar,
        },
      });
      return updatedUser;
    } catch (error) {
      console.log(error, "ini error di model");
      throw new Error('Gagal mengubah foto profil.', 500);
    }
  }

  static async changePassword(id, { oldPassword, newPassword }) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        throw new Error('Password lama yang Anda masukkan salah.', 401);
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

    }catch (error) {
      throw new Error('Gagal mengubah kata sandi.', 500);
    }
  }
  static async deleted (id) {
    try {
      const user = await prisma.user.delete({
        where: {
          id: id,
        },
      });
      return user;
    } catch (error) {
      throw new Error('Gagal menghapus user.', 500);
    }
  }
  static async getAll() {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: 'admin'
        }
      }
    });
    return users;
  }
  static async getById(id) { 
    try{

      const user = await prisma.user.findUnique({
        where: { id: id },
        include: {
          tasks: {
            include: { project: true } 
          }
        }
      });
      return user;
    }catch (error) {
      console.log(error, "ini error di model");
      throw new Error('Gagal mengambil data user.', 500);
    }
  }
  static async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }

}

module.exports = User;
