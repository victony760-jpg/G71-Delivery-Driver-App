import express from 'express';
import { register, login, getProfile } from '../controllers/authControllers.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { authLimiter, loginLimiter } from '../middleware/rateLimiter.js';
import {
  loginRules,
  registerRules,
  validate,
} from '../middleware/validateMiddleware.js';

const router = express.Router();
router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', loginLimiter, loginRules, validate, login);
router.get('/profile', protect, getProfile);
router.get('/admin-only', protect, authorize('admin'), (req, res) =>
  res.json({ message: 'Admin Access Granted' }),
);

export default router;
