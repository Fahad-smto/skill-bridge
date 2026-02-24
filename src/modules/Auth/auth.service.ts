import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

export const secret = 'secretKey';

// ─────────────────────────────────────────
// Register Service
// ─────────────────────────────────────────
const createUserIntoDB = async (payload: any) => {

   // Destructure only required fields
   // This prevents extra fields like "status" from being sent to DB
   const { name, email, password, role } = payload;

   // Check all fields are provided
   if (!name || !email || !password || !role) {
      throw new Error("All fields are required");
   }

   // Check role is valid
   if (!['STUDENT', 'TUTOR'].includes(role)) {
      throw new Error("Role must be STUDENT or TUTOR");
   }

//  Check if email already exists
   const existingUser = await prisma.user.findUnique({
      where: { email }
   });
   if (existingUser) {
      throw new Error("Email already registered");
   }

   // Hash password
   const hashPassword = await bcrypt.hash(password, 8);

   // Create user with only allowed fields
   const result = await prisma.user.create({
      data: {
         name,
         email,
         password: hashPassword,
         role,
        
      }
   });

   // Remove password before returning
   const { password: _, ...userWithoutPassword } = result;
   return userWithoutPassword;
}

// ─────────────────────────────────────────
// Login Service
// ─────────────────────────────────────────
const loginUserIntoDB = async (payload: any) => {

   const { email, password } = payload;

   // Check all fields are provided
   if (!email || !password) {
      throw new Error("Email and password are required");
   }

   // Find user by email
   const user = await prisma.user.findUnique({
      where: { email }
   });

   // User not found
   if (!user) {
      throw new Error("Invalid email or password");
   }

   // Check if user is banned
   if (user.isBanned) {
      throw new Error("Your account has been banned");
   }

   // Check password
   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
      throw new Error("Invalid email or password");
   }

   // Build token payload
   const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
   }

   // Generate JWT token
   const token = jwt.sign(userData, secret, { expiresIn: '1d' });

   return { token, user: userData };
}

export const AuthService = {
   createUserIntoDB,
   loginUserIntoDB
};