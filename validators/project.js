const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Project {
  static async create(data) {
    const { name, description } = data;
    if (!name || !description) {
      throw new Error("Semua field harus diisi");
    }
  }
}

module.exports = Project;
