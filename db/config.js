const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const connectDB = async (req , res)=>{
    try{
        await prisma.$connect()
        console.log("database connected")
    }catch (e){
        console.log(e)
    }
}

module.exports={prisma , connectDB};
