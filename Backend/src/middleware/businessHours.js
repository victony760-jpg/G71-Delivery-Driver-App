import { getBusinessHoursStatus } from '../utils/businessHours.js';

export const requireBusinessHours = (req, res, next) => {
  const businessHours = getBusinessHoursStatus();
  if (!businessHours.isOpen)
    return res.status(503).json({
      success: false,
      code: 'BUSINESS_CLOSED',
      message: businessHours.message,
      businessHours,
    });

  return next();
};
