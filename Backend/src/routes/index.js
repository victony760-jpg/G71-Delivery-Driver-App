import { Router } from 'express';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import driverRoutes from './driverRoutes.js';
import publicRoutes from './publicRoutes.js';
import shipmentRoutes from './shipmentRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/driver', driverRoutes);
router.use('/public', publicRoutes);
router.use('/shipments', shipmentRoutes);

export default router;
