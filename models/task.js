const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Task {
  static async getAll() {
    return prisma.task.findMany();
  }
  static async getByUser(userId) {
    const task = prisma.task.findMany({
      where: {
        userId: userId,
      },
      select: {
        task: true,
      },
    });

    console.log(task);
    return task;
  }
  static async getById(id) {
    const task = await prisma.task.findFirst({
      where: {
        id: id,
      },
    });
    return task;
  }
  static async create(data) {
    try {
      const { name, description, status } = data;
      return await prisma.task.create({
        data: {
          name,
          description,
          status,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
  static async getById(id) {
    const task = await prisma.task.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        project: true,
      },
    });
    return task;
  }
  static async update(id, data) {
    try {
      const { name, description, status } = data;
      return await prisma.task.update({
        where: {
          id: id,
        },
        data: {
          name,
          description,
          status,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
  static async delete(id) {
    try {
      return await prisma.task.delete({
        where: {
          id: id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
  static async getByUser(userId) {
    const task = await prisma.task.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        project: true,
      },
    });
    return task;
  }
  static async create(data, projectId) {
    try {
      const { title, description, dueDate, status, userId } = data;

      return await prisma.task.create({
        data: {
          title,
          description,
          status,
          dueDate: new Date(dueDate),
          userId,
          projectId : projectId
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error("Terjadi kesalahan saat membuat task. Silakan coba lagi.");
    }
  }
  static async updateStatus(userId, id, data) {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      });
      if (tasks.length === 0) {
        throw new Error("Task tidak ditemukan");
      }
      const idExists = tasks.some((task) => task.id === id);

      if (!idExists) {
        throw new Error("Task tidak ditemukan");
      }
      const { status } = data;
      return await prisma.task.update({
        where: {
          id: id,
        },
        data: {
          status,
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error("Terjadi kesalahan saat mengubah status task. Silakan coba lagi.");
    }
  }
  static async update(id, data) {
    try {
      const { name, description, dueDate, userId } = data;
      return await prisma.task.update({
        where: {
          id: id,
        },
        data: {
          name,
          description,
          dueDate: new Date(dueDate),
          userId,
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error("Terjadi kesalahan saat mengubah task. Silakan coba lagi.");
    }
  }
  static async delete(id) {
    try {
      return await prisma.task.delete({
        where: {
          id: id,
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error("Terjadi kesalahan saat menghapus task. Silakan coba lagi.");
    }
  }
}

module.exports = Task;
