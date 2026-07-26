import express from 'express';
import { AdminController } from './admin.controller';
import auth, { userRole } from '../../middlewares/auth';

const router = express.Router();

// 🔒   route ADMIN token  
router.use(auth(userRole.ADMIN));

// Users
router.get('/users', AdminController.getAllUsers);
router.patch('/users/:id', AdminController.updateUserStatus);

// Bookings
router.get('/bookings', AdminController.getAllBookings);

export const AdminRoutes = router;