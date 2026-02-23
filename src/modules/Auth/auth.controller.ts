import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";


const createUser = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.createUserIntoDB(req.body)
       sendResponse(res,{
            statusCode:201,
            success:true,
            message:'user created',
            data:result,
        })
     
    } catch (error) {
       sendResponse(res,{
            statusCode:500,
            success:false,
            message:'something went wrong',
            data:error,
        })
    }
}
const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.loginUserIntoDB(req.body)


        res.cookie('token',result.token,{
            secure :false,
            httpOnly:true,
            sameSite:'strict'
        })


        sendResponse(res,{
            statusCode:201,
            success:true,
            message:'login successfully',
            data:result,
        })
     
    } catch (error) {
       sendResponse(res,{
            statusCode:500,
            success:false,
            message:'something went wrong',
            data:error,
        })
    }
}


export const AuthController = {
    createUser,
    loginUser
};