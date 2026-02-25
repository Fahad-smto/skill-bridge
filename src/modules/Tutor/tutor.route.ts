import express from 'express';
import { TutorController } from './tutor.controller';
import auth, { userRole } from '../../middlewares/auth';

const router = express.Router();

// existing
router.post('/', auth(userRole.TUTOR), TutorController.createTutor);

// NEW — Set Availability
router.put('/availability', auth(userRole.TUTOR), TutorController.setAvailability);

export const TutorRoutes = router;