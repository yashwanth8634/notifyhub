import { Router } from 'express';
import { statsController } from '../controllers/statsController.js';

const router = Router();

router.get('/', statsController.getStats); // Public or auth depending on need. Making it public for homepage.

export default router;
