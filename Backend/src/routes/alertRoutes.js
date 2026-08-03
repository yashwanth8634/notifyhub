import { Router } from 'express';
import { alertController } from '../controllers/alertController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

router.get('/', alertController.findAll);

const publishingRoles = ['principal', 'dean', 'hod', 'faculty', 'super_admin'];
router.post('/', authenticate, requireRole(publishingRoles), alertController.create);
router.put('/:id', authenticate, requireRole(publishingRoles), alertController.update);

// Delete ONLY for super_admin
router.delete('/:id', authenticate, requireRole(['super_admin']), alertController.delete);

export default router;
