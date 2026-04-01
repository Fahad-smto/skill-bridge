import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

// ✅ hardcode না করে env use করো
const secret = process.env.JWT_SECRET as string;

const createUserIntoDB = async (payload: any) => {
   const { name, email, password, role } = payload;

   if (!name || !email || !password || !role) {
      throw new Error("All fields are required");
   }

   if (!['STUDENT', 'TUTOR'].includes(role)) {
      throw new Error("Role must be STUDENT or TUTOR");
   }

   const existingUser = await prisma.user.findUnique({
      where: { email }
   });
   if (existingUser) {
      throw new Error("Email already registered");
   }

   const hashPassword = await bcrypt.hash(password, 8);

   const result = await prisma.user.create({
      data: { name, email, password: hashPassword, role }
   });

   const { password: _, ...userWithoutPassword } = result;

   const userData = {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role,
   }

   const token = jwt.sign(userData, secret, { expiresIn: '1d' });
   return { token, user: userData };
}

const loginUserIntoDB = async (payload: any) => {
   const { email, password } = payload;

   if (!email || !password) {
      throw new Error("Email and password are required");
   }

   const user = await prisma.user.findUnique({ where: { email } });

   if (!user) throw new Error("Invalid email or password");
   if (user.isBanned) throw new Error("Your account has been banned");

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) throw new Error("Invalid email or password");

   const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
   }

   const token = jwt.sign(userData, secret, { expiresIn: '1d' });
   return { token, user: userData };
}

export const AuthService = {
   createUserIntoDB,
   loginUserIntoDB
};