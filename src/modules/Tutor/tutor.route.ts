import express from 'express';
import { TutorController } from './tutor.controller';
import auth, { userRole } from '../../middlewares/auth';

const router = express.Router();
router.post('/',auth(userRole.TUTOR),TutorController.createTutor
)

export const TutorRoutes = router;
