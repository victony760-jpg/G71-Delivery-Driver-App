import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createShipment,
  getShipments,
  getShipment,
  trackShipment,
  updateStatus,
  assignDriver,
  generateDeliveryOtp,
  verifyDeliveryOtp,
} from '../controllers/shipmentControllers.js';
import { otpLimiter, trackLimiter } from '../middleware/rateLimiter.js';
import {
  createShipmentRules,
  otpRules,
  validate,
} from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/track/:trackingId', trackLimiter, trackShipment);

router.use(protect);

router.post(
  '/',
  authorize('client', 'admin'),
  createShipmentRules,
  validate,
  createShipment,
);
router.get('/', getShipments);
router.get('/:id', getShipment);
router.put(
  '/:id/status',
  authorize('driver', 'admin'),
  updateStatus,
);
router.put('/:id/assign', authorize('admin'), assignDriver);
router.post(
  '/:id/generate-otp',
  authorize('driver', 'admin'),
  otpLimiter,
  generateDeliveryOtp,
);
router.post(
  '/:id/verify-otp',
  authorize('driver', 'admin'),
  otpRules,
  validate,
  verifyDeliveryOtp,
);
export default router;
