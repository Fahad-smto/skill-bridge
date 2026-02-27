import express from 'express';
import { ReviewController } from './review.controller';
import auth, { userRole } from '../../middlewares/auth';

const router = express.Router();

// 🔒 Student only — review দিতে পারবে
router.post('/', auth(userRole.STUDENT), ReviewController.createReview);

// ✅ Public — যেকেউ tutor এর reviews দেখতে পারবে
router.get('/tutor/:tutorProfileId', ReviewController.getTutorReviews);

export const ReviewRoutes = router;