import express from 'express';
import { TutorController } from './tutor.controller';
import auth, { userRole } from '../../middlewares/auth';

const router = express.Router();

// ✅ Public Routes — token লাগবে না
router.get('/', TutorController.getAllTutors);
router.get('/:id', TutorController.getTutorById);

// 🔒 Private Routes — TUTOR token লাগবে
router.post('/', auth(userRole.TUTOR), TutorController.createTutor);
router.get('/me', auth(userRole.TUTOR), TutorController.getMyProfile);
router.put('/me', auth(userRole.TUTOR), TutorController.updateTutorProfile);
router.put('/availability', auth(userRole.TUTOR), TutorController.setAvailability);

export const TutorRoutes = router;