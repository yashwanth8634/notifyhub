import { Router } from 'express';
import { announcementController } from '../controllers/announcementController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

// Public Read (Requires auth depending on institutional policy, but we'll assume logged in for internal notices)
router.get('/', announcementController.findAll);

// Publishers only
const publishingRoles = ['principal', 'dean', 'hod', 'faculty', 'super_admin'];

router.post('/', authenticate, requireRole(publishingRoles), announcementController.create);
router.put('/:id', authenticate, requireRole(publishingRoles), announcementController.update);

// Delete ONLY for super_admin
router.delete('/:id', authenticate, requireRole(['super_admin']), announcementController.delete);

export default router;
