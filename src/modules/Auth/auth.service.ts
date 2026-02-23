import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";


const createUserIntoDB = async (payload: any) => {
   const hashPassword = await bcrypt.hash(payload.password, 10);

   const result = await prisma.user.create({
      data: { ...payload, password: hashPassword }
   });
   const { password, ...newresult } = result;
   return result
}
const loginUserIntoDB = async (payload: any) => {

   const user = await prisma.user.findUnique({
      where: {
         email: payload.email
      }
   });
   if (!user) {
      throw new Error("User not found")
   }


   const isPasswordValid = await bcrypt.compare(payload.password, user.password);

   if (!isPasswordValid) {
      throw new Error("Invalid password")
   }

   const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
   }


   const token = jwt.sign(userData, 'secretKey', { expiresIn: '1d' })

   return { token, user: userData } 

}




export const AuthService = {
   createUserIntoDB,
   loginUserIntoDB
};