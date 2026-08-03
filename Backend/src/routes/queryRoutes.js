import { Router } from 'express';
import { queryController } from '../controllers/queryController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

router.get('/', authenticate, queryController.findAll);

// Only students can create queries
router.post('/', authenticate, requireRole(['student']), queryController.create);

// Only super_admin or hod can respond
router.put('/:id/respond', authenticate, requireRole(['super_admin', 'hod']), queryController.respond);

export default router;
