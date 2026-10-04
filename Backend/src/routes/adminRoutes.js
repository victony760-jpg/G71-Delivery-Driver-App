import express from 'express';
import {
  approveRequest,
  createDriver,
  deleteUser,
  getAllRequests,
  getAllUsers,
  getDriverApplications,
  getDriverPerformance,
  getDriverProfile,
  getLiveDrivers,
  getSingleDriverApplication,
  getStats,
  getUsersByRole,
  rejectRequest,
} from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { parseDriverAvatarUpload } from '../middleware/driverApplicationUpload.js';

const router = express.Router();

router.use(protect);

router.get('/users', authorize('admin'), asyncHandler(getAllUsers));
router.post(
  '/users',
  authorize('admin'),
  parseDriverAvatarUpload,
  asyncHandler(createDriver),
);
router.get('/drivers/:id', authorize('admin'), asyncHandler(getDriverProfile));
router.get(
  '/driver-performance',
  authorize('admin'),
  asyncHandler(getDriverPerformance),
);
router.get('/role/:role', authorize('admin'), asyncHandler(getUsersByRole));
router.delete('/:id', authorize('admin'), asyncHandler(deleteUser));
router.get('/stats', authorize('admin'), asyncHandler(getStats));
router.get(
  '/live-drivers',
  authorize('admin'),
  asyncHandler(getLiveDrivers),
);
router.get(
  '/requests',
  authorize('admin'),
  asyncHandler(getAllRequests),
);
router.get(
  '/driver-applications',
  authorize('admin'),
  asyncHandler(getDriverApplications),
);
router.get(
  '/driver-applications/:id',
  authorize('admin'),
  asyncHandler(getSingleDriverApplication),
);
router.put(
  '/requests/:id/approve',
  authorize('admin'),
  asyncHandler(approveRequest),
);
router.put(
  '/requests/:id/reject',
  authorize('admin'),
  asyncHandler(rejectRequest),
);

export default router;
