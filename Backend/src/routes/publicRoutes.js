import express from 'express';
import {
  createRequest,
  trackByCode,
  submitContact,
} from '../controllers/publicController.js';
import { publicLimiter, trackLimiter } from '../middleware/rateLimiter.js';
import {
  createRequestRules,
  validate,
} from '../middleware/validateMiddleware.js';
import { requireBusinessHours } from '../middleware/businessHours.js';
import { getBusinessHoursStatus } from '../utils/businessHours.js';
const router = express.Router();

router.get('/business-hours', (req, res) =>
  res.json({ success: true, businessHours: getBusinessHoursStatus() }),
);
router.post(
  '/requests',
  publicLimiter,
  requireBusinessHours,
  createRequestRules,
  validate,
  createRequest,
);
router.get('/tracking/:code', trackLimiter, trackByCode);
router.post('/contact', publicLimiter, submitContact);

export default router;
