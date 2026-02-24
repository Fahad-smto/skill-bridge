import { prisma } from "../../lib/prisma";

const createTutorIntoDB = async (payload: any) => {
    

   const result = await prisma.user.create({
      data: { ...payload}
   });
   const { password, ...newresult } = result;
   return result
}



export const TutorService = {
   createTutorIntoDB
    };