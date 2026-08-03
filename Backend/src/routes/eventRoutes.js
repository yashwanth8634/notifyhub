import { Router } from 'express';
import { eventController } from '../controllers/eventController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

router.get('/', eventController.findAll);

const publishingRoles = ['principal', 'dean', 'hod', 'faculty', 'super_admin'];
router.post('/', authenticate, requireRole(publishingRoles), eventController.create);
router.put('/:id', authenticate, requireRole(publishingRoles), eventController.update);

// Delete ONLY for super_admin
router.delete('/:id', authenticate, requireRole(['super_admin']), eventController.delete);

export default router;
