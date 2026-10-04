import User from '../models/user.js';
import { generateToken } from '../utils/generateToken.js';
import { getApplicationDocumentViewUrl } from '../services/supabaseStorageService.js';

const getAvatarUrl = async (user) => {
  if (user.avatarIsPublic && user.avatarUrl) return user.avatarUrl;
  if (!user.avatarPublicId) return null;
  try {
    return await getApplicationDocumentViewUrl({
      publicId: user.avatarPublicId,
      format: user.avatarFormat,
      resourceType: user.avatarResourceType,
    });
  } catch (err) {
    console.error('DRIVER AVATAR URL ERROR:', err.message);
    return null;
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Provide name, email, password' });
    if (password.length < 8)
      return res
        .status(400)
        .json({ success: false, message: 'Password min 8 chars' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' });

    // PHASE 2 FIX: Force client, ignore any role from body
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: 'client',
    });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city,
      avatarUrl: await getAvatarUrl(user),
      mustChangePassword: user.mustChangePassword,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Provide email and password' });

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password',
    );
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password, please try again.',
      });
    }

    if (!['admin', 'driver', 'client'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'This account role is no longer supported. Contact an administrator.',
      });
    }

    if (user.isActive === false) {
      return res
        .status(403)
        .json({ success: false, message: 'Account deactivated' });
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      city: user.city,
      avatarUrl: await getAvatarUrl(user),
      mustChangePassword: user.mustChangePassword,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  const {
    avatarPublicId,
    avatarFormat,
    avatarResourceType,
    avatarUrl: storedAvatarUrl,
    avatarIsPublic,
    password,
    ...user
  } = req.user.toObject();
  res.json({
    success: true,
    user: {
      ...user,
      avatarUrl: await getAvatarUrl({
        avatarPublicId,
        avatarFormat,
        avatarResourceType,
        avatarUrl: storedAvatarUrl,
        avatarIsPublic,
      }),
    },
  });
};
