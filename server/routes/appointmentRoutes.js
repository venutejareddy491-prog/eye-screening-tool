import { Router } from 'express';
import { body } from 'express-validator';
import { bookAppointment, getMyAppointments } from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/book',
  protect,
  [
    body('patientName').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('phone').trim().notEmpty(),
    body('appointmentDate').isISO8601(),
    body('symptoms').trim().notEmpty().isLength({ max: 2000 }),
  ],
  validate,
  bookAppointment
);

router.get('/mine', protect, getMyAppointments);

export default router;
