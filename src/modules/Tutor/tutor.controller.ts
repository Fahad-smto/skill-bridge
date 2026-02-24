import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { TutorService } from "./tutor.service";

const createTutor = async (req: Request, res: Response) => {
    try {
        const result = await TutorService.createTutorIntoDB(req.body)
       sendResponse(res,{
            statusCode:201,
            success:true,
            message:'tutor created',
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



export const TutorController = {
   createTutor
    };