import { body, param, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

export const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name min 2 chars'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Valid phone required'),
];

export const loginRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

export const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
];

export const createShipmentRules = [
  body('pickupAddress')
    .isString()
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Pickup address is required and must be under 300 characters'),
  body('deliveryAddress')
    .isString()
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage(
      'Delivery address is required and must be under 300 characters',
    ),
  body('receiverName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage('Receiver name is required'),
  body('receiverPhone').optional().isString().trim().isLength({ max: 32 }),
  body('packageDescription')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 }),
  body('weight')
    .optional()
    .isFloat({ min: 0.01, max: 1000 })
    .toFloat()
    .withMessage('Weight must be between 0.01 and 1000 kg'),
];

export const createRequestRules = [
  body('senderName').trim().notEmpty().withMessage('Sender name required'),
  body('senderPhone').trim().notEmpty().withMessage('Sender phone required'),
  body('senderEmail')
    .isEmail()
    .withMessage('Valid sender email required')
    .normalizeEmail(),
  body('pickup').trim().notEmpty().withMessage('Pickup address required'),
  body('dropoff').trim().notEmpty().withMessage('Dropoff address required'),
  body('receiverName').trim().notEmpty().withMessage('Receiver name required'),
  body('receiverPhone')
    .trim()
    .notEmpty()
    .withMessage('Receiver phone required'),
  body('packageType').trim().notEmpty().withMessage('Package type required'),
  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .toFloat()
    .withMessage('Weight must be positive'),
  body('note').optional().trim(),
];

export const otpRules = [
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric(),
];
