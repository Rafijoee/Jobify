const ImageKit = require("imagekit");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

class User {
  static async login (email, password) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        const error = new Error("Email atau kata sandi yang Anda masukkan salah.");
        error.statusCode = 401;
        throw error;
    }
    return user;

    }catch (error) {
      throw error;
    }
  }
  static async register( datas, file ) {
    try {
        const { name, email, password, role} = datas;
        const existingEmail = await prisma.user.findUnique({
            where: { email: String(email) }
        });

        if (existingEmail) {
            throw new Error('Email sudah terdaftar.');
        }

        let avatar = null;
        if (file) {
          const uploadImageKit = await imagekit.upload({
            file: file.buffer.toString("base64"), 
            fileName: file.originalname,
            folder: "Foto-Profile",
          });
          avatar = uploadImageKit.url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: String(name),
                email: String(email),
                password: hashedPassword,
                avatar : String(avatar),
                role: role || 'user'
            }
        });
        return user;
    } catch (error) {
      console.log(error, "ini error di model");
      throw new Error('Gagal melakukan registrasi. ini di model');
    }
}
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
