import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import announcementRoutes from './announcementRoutes.js';
import alertRoutes from './alertRoutes.js';
import eventRoutes from './eventRoutes.js';
import queryRoutes from './queryRoutes.js';
import webhookRoutes from './webhookRoutes.js';
import statsRoutes from './statsRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/announcements', announcementRoutes);
router.use('/alerts', alertRoutes);
router.use('/events', eventRoutes);
router.use('/queries', queryRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/stats', statsRoutes);

export default router;
