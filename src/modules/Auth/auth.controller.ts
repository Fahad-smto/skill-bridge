import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.createUserIntoDB(req.body);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: 'User created successfully',
            data: result,
        });

    } catch (error: any) {
     
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message || 'Something went wrong',
            data: null,
        });
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.loginUserIntoDB(req.body);

        res.cookie('token', result.token, {
            secure: false,
            httpOnly: true,
            sameSite: 'strict'
        });

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Login successful',
            data: result,
        });

    } catch (error: any) {
       
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message || 'Something went wrong',
            data: null,
        });
    }
}

export const AuthController = {
    createUser,
    loginUser
};