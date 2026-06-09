import { Router } from 'express';
import { getUsers, getReports, updateAppointmentStatus } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/users', getUsers);
router.get('/reports', getReports);
router.patch('/appointments/:id', updateAppointmentStatus);

export default router;
