import express from 'express';
import { ReviewController } from './review.controller';
import auth, { userRole } from '../../middlewares/auth';

const router = express.Router();

router.get('/tutor/:tutorProfileId', ReviewController.getTutorReviews);

export const ReviewRoutes = router;