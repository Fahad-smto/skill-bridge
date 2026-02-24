import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { TutorService } from "./tutor.service";

const createTutor = async (req: Request, res: Response) => {
    try {
        console.log('controller',req?.user);
        const result = await TutorService.createTutorIntoDB(req.body,req.user?.id);
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