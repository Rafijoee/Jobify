const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Project {
    static async getAll() {
        return prisma.project.findMany();
    }
    static async getByUser(userId){
        const project =  prisma.task.findMany({
            where: {
                userId: userId
            },
            select : {
                project : true
            }
        });

        console.log( project );
        return project;
    }
    static async create (data){
        try {
            const { name, description, status } = data;
            return  await prisma.project.create({
                data: {
                    name,
                    description,
                    status,
                }
            });
        }catch (err){
            console.log(err);
        }
    }
    static async getById(id){
        const project = await prisma.project.findFirst({
            where: {
                id: id
            }, select: {
                id : true,
                name : true,
                description : true,
                status : true,
                tasks : true
            }
        });        
        return project;

    }
    static async update (id, data){
        try {
            const { name, description, status } = data;
            return await prisma.project.update({
                where: {
                    id: id
                },
                data: {
                    name,
                    description,
                    status,
                }
            });
        }catch (err){
            console.log(err);
            throw new Error('Terjadi kesalahan saat mengupdate project');
        }
    }
    static async delete (id){
        try {
            return await prisma.project.delete({
                where: {
                    id: id
                }
            });
        }catch (err){
            console.log(err);
            throw new Error('Terjadi kesalahan saat menghapus project');
        }
    }
}

module.exports = Project;
