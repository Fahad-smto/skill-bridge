import express from 'express';
import { ReviewController } from './review.controller';
import auth, { userRole } from '../../middlewares/auth';

const router = express.Router();

//   Public —  tutor  reviews  
router.get('/tutor/:tutorProfileId', ReviewController.getTutorReviews);

export const ReviewRoutes = router;