import express from 'express';
import { TutorController } from './tutor.controller';
import auth, { userRole } from '../../middlewares/auth';

const router = express.Router();

// Create tutor profile
router.post('/', auth(userRole.TUTOR), TutorController.createTutor);

// Get my profile
router.get('/me', auth(userRole.TUTOR), TutorController.getMyProfile);

// Update my profile
router.put('/me', auth(userRole.TUTOR), TutorController.updateTutorProfile);

// Set availability
router.put('/availability', auth(userRole.TUTOR), TutorController.setAvailability);

export const TutorRoutes = router;