import { Router } from 'express';
import { submitScreening, getResults, getScreeningById, emailReport } from '../controllers/screeningController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/submit', submitScreening);
router.get('/results', getResults);
router.post('/:id/email', emailReport);
router.get('/:id', getScreeningById);

export default router;
