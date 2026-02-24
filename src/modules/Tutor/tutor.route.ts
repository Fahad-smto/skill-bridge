import express from 'express';
import { TutorController } from './tutor.controller';
import auth from '../../middlewares/auth';

const router = express.Router();
router.post('/',auth('tutoreee'),TutorController.createTutor
)

export const TutorRoutes = router;
