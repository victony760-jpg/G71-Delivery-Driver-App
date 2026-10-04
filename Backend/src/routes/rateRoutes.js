import express from 'express';
import {
  getActiveRate,
  getAllRates,
  updateRate,
} from '../controllers/rateController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const validateRate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  next();
};
const rateRules = [
  body('baseFee').optional().isFloat({ min: 0 }).toFloat(),
  body('perKgFee').optional().isFloat({ min: 0 }).toFloat(),
  body('perKmFee').optional().isFloat({ min: 0 }).toFloat(),
  body('driverShare').optional().isFloat({ min: 0 }).toFloat(),
];

const router = express.Router();

router.get('/active', getActiveRate);
router.get('/', protect, authorize('admin'), getAllRates);
router.put(
  '/',
  protect,
  authorize('admin'),
  rateRules,
  validateRate,
  updateRate,
);

export default router;
