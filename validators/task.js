const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Task {
  static async create(data, projectId) {
    console.log(data);
    const { title, description, dueDate, userId } = data;
    if (!title) {
      throw new Error("Title wajib diisi");
    }
    if (!description) {
      throw new Error("Description wajib diisi");
    }
    if (!dueDate) {
      throw new Error("Due date wajib diisi");
    }
    if (!userId) {
      throw new Error("User ID wajib diisi");
    }
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("User tidak ditemukan");
    }
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      throw new Error("Project tidak ditemukan");
    }
  }
  static async update(data) {
    const { title, description, dueDate, userId } = data;
    if (!title) {
      throw new Error("Title wajib diisi");
    }
    if (!description) {
      throw new Error("Description wajib diisi");
    }
    if (!dueDate) {
      throw new Error("Due date wajib diisi");
    }
    if (!userId) {
      throw new Error("User ID wajib diisi");
    }
  }
}

module.exports = Task;
