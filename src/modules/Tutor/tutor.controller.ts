import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { TutorService } from "./tutor.service";

const createTutor = async (req: Request, res: Response) => {
   try {
      console.log('controller', req?.user);
      const result = await TutorService.createTutorIntoDB(req.body, req.user?.id);
      sendResponse(res, {
         statusCode: 201,
         success: true,
         message: 'tutor created',
         data: result,
      });
   } catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         success: false,
         message: error.message || 'something went wrong',
         data: null,
      });
   }
};

// ─────────────────────────────────────────
// NEW — Set Availability
// ─────────────────────────────────────────
const setAvailability = async (req: Request, res: Response) => {
   try {
      const userId = req.user?.id;
      const { slots } = req.body;

      const result = await TutorService.setAvailabilityIntoDB(userId, slots);

      sendResponse(res, {
         statusCode: 200,
         success: true,
         message: 'Availability set successfully',
         data: result,
      });
   } catch (error: any) {
      sendResponse(res, {
         statusCode: 500,
         success: false,
         message: error.message || 'something went wrong',
         data: null,
      });
   }
};

export const TutorController = {
   createTutor,
   setAvailability, // ← NEW
};