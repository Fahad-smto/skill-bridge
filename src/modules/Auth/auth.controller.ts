// auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

// ─────────────────────────────────────────
// Register Controller
// ─────────────────────────────────────────
const createUser = async (req: Request, res: Response) => {
   try {
      const result = await AuthService.createUserIntoDB(req.body);
      
      // ✅ এখন result এ token এবং user দুটোই আছে
      res.status(201).json({
         success: true,
         message: "Registration successful!",
         token: result.token,    // টোকেন পাঠাচ্ছি
         user: result.user        // ইউজার ডাটা পাঠাচ্ছি
      });
      
   } catch (error: any) {
      res.status(400).json({
         success: false,
         message: error.message || "Registration failed"
      });
   }
};

// ─────────────────────────────────────────
// Login Controller
// ─────────────────────────────────────────
const loginUser = async (req: Request, res: Response) => {
   try {
      const result = await AuthService.loginUserIntoDB(req.body);
      
      res.status(200).json({
         success: true,
         message: "Login successful!",
         token: result.token,
         user: result.user
      });
      
   } catch (error: any) {
      res.status(401).json({
         success: false,
         message: error.message || "Login failed"
      });
   }
};

export const AuthController = {
   createUser,
   loginUser
};