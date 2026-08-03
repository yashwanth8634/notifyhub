import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

// All user routes require super_admin
router.use(authenticate, requireRole(['super_admin']));

router.get('/', userController.findAll);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.deactivate);
router.post('/:id/reset-password', userController.resetPassword);

export default router;
