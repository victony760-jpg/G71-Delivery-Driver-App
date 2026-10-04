import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer'))
      token = req.headers.authorization.split(' ')[1];
    if (!token)
      return res.status(401).json({ success: false, message: 'Not logged in' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: 'User not found' });
    if (!['admin', 'driver', 'client'].includes(user.role))
      return res
        .status(403)
        .json({ success: false, message: 'This account role is no longer supported' });
    if (user.isActive === false)
      return res
        .status(403)
        .json({ success: false, message: 'Account deactivated' });
    const passwordChangeAllowed =
      req.baseUrl === '/api/driver' && req.path === '/change-password';
    if (user.mustChangePassword && !passwordChangeAllowed)
      return res.status(403).json({
        success: false,
        code: 'PASSWORD_CHANGE_REQUIRED',
        message: 'Change your temporary password before continuing',
      });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
  };
