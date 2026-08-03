import { Router } from 'express';
import { webhookController } from '../controllers/webhookController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

router.post('/subscribe', authenticate, requireRole(['super_admin']), webhookController.subscribe);

export default router;
