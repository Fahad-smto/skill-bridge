import { Request, Response } from "express";
import { AuthService } from "./auth.service";


const createUser = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.createUserIntoDB(req.body)
        res.status(201).json({ message: "User created successfully", data: result })
    } catch (error) {
        console.error("REGISTER ERROR 👉", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}
const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.loginUserIntoDB(req.body)
        res.status(200).json({ message: "User logged in successfully", data: result })
    } catch (error) {
        console.error("LOGIN ERROR 👉", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : error
        });
    }
}


export const AuthController = {
    createUser,
    loginUser
};