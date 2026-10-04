import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { parseDriverApplicationUpload } from '../middleware/driverApplicationUpload.js';
import { otpLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  changePasswordRules,
  otpRules,
  validate,
} from '../middleware/validateMiddleware.js';
import {
  getDriverNewJobs,
  getDriverJobs,
  getNextJob,
  acceptJob,
  declineJob,
  getDriverHistory,
  updateDriverLocation,
  updateJobStatus,
  verifyDeliveryOtp,
  applyAsDriver,
  getApplications,
  acceptDriverApplication,
  rejectDriverApplication,
  changePassword,
} from '../controllers/driverController.js';
import { getDriverEarnings } from '../controllers/driverController.js';

const router = express.Router();
router.post(
  '/apply',
  parseDriverApplicationUpload,
  asyncHandler(applyAsDriver),
);
router.use(protect);
router.put(
  '/change-password',
  authorize('driver'),
  changePasswordRules,
  validate,
  asyncHandler(changePassword),
);
router.get('/new-jobs', authorize('driver'), asyncHandler(getDriverNewJobs));
router.get('/jobs', authorize('driver'), asyncHandler(getDriverJobs));
router.put('/jobs/:id/accept', authorize('driver'), asyncHandler(acceptJob));
router.put('/jobs/:id/decline', authorize('driver'), asyncHandler(declineJob));
router.get('/next-job', authorize('driver'), asyncHandler(getNextJob));
router.get('/history', authorize('driver'), asyncHandler(getDriverHistory));
router.put(
  '/location',
  authorize('driver'),
  asyncHandler(updateDriverLocation),
);
router.put(
  '/job/:id/status',
  authorize('driver'),
  asyncHandler(updateJobStatus),
);
router.post(
  '/job/:id/verify-otp',
  authorize('driver'),
  otpLimiter,
  otpRules,
  validate,
  asyncHandler(verifyDeliveryOtp),
);
router.get('/applications', authorize('admin'), asyncHandler(getApplications));
router.post(
  '/applications/:id/accept',
  authorize('admin'),
  asyncHandler(acceptDriverApplication),
);
router.post(
  '/applications/:id/reject',
  authorize('admin'),
  asyncHandler(rejectDriverApplication),
);
router.get('/earnings', authorize('driver'), asyncHandler(getDriverEarnings));
export default router;
