import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import DriverApplication from '../models/driverApplication.js';
import Shipment from '../models/shipment.js';
import User from '../models/user.js';
import { sendDriverWelcomeEmail } from '../utils/sendEmail.js';
import {
  deleteApplicationDocuments,
  getApplicationDocumentDownloadUrl,
  uploadApplicationDocuments,
} from '../services/supabaseStorageService.js';

export const getDriverJobs = async (req, res) => {
  const shipments = await Shipment.find({
    driver: req.user._id,
    status: { $ne: 'delivered' },
  })
    .populate('client', 'name phone')
    .sort('-createdAt');
  res.json({ success: true, shipments });
};

export const getDriverNewJobs = async (req, res) => {
  const jobs = await Shipment.find({
    driver: req.user._id,
    status: 'pending',
  }).sort('-createdAt');
  res.json({ success: true, jobs });
};

export const getNextJob = async (req, res) => {
  const job = await Shipment.findOne({
    driver: req.user._id,
    status: { $in: ['pending', 'picked_up', 'in_transit', 'out_for_delivery'] },
  }).sort('createdAt');
  res.json({ success: true, job });
};

export const getDriverHistory = async (req, res) => {
  const shipments = await Shipment.find({
    driver: req.user._id,
    status: 'delivered',
  }).sort('-createdAt');
  res.json({ success: true, shipments });
};

// PHASE 21 - REAL EARNINGS FROM DB
export const getDriverEarnings = async (req, res) => {
  try {
    const driverId = req.user._id;
    const allShipments = await Shipment.find({ driver: driverId }).select(
      'status estimatedDelivery history price driverEarning trackingId deliveryAddress createdAt updatedAt',
    );
    const shipments = allShipments.filter(
      (shipment) => shipment.status === 'delivered',
    );
    const cancelledCount = allShipments.filter(
      (shipment) => shipment.status === 'cancelled',
    ).length;

    const totalEarnings = shipments.reduce(
      (sum, s) => sum + (s.driverEarning || 0),
      0,
    );
    const totalRevenue = shipments.reduce((sum, s) => sum + (s.price || 0), 0);
    const onTimeEligible = shipments.filter(
      (shipment) =>
        shipment.estimatedDelivery &&
        shipment.history.some(
          (event) => event.status === 'delivered' && event.createdAt,
        ),
    );
    const onTimeDeliveries = onTimeEligible.filter((shipment) => {
      const deliveredAt = shipment.history.find(
        (event) => event.status === 'delivered',
      ).createdAt;
      return deliveredAt <= shipment.estimatedDelivery;
    }).length;
    const onTimeRate = onTimeEligible.length
      ? Number(((onTimeDeliveries / onTimeEligible.length) * 100).toFixed(1))
      : null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayShipments = shipments.filter(
      (s) => new Date(s.updatedAt) >= today,
    );
    const todayEarnings = todayShipments.reduce(
      (sum, s) => sum + (s.driverEarning || 0),
      0,
    );

    const last7 = new Date();
    last7.setDate(last7.getDate() - 7);
    const chart = await Shipment.aggregate([
      {
        $match: {
          driver: driverId,
          status: 'delivered',
          updatedAt: { $gte: last7 },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          earnings: { $sum: '$driverEarning' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      totalEarnings,
      totalRevenue,
      todayEarnings,
      deliveredCount: shipments.length,
      totalJobs: allShipments.length,
      cancelledCount,
      onTimeEligibleCount: onTimeEligible.length,
      onTimeRate,
      todayCount: todayShipments.length,
      chart,
      shipments,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const acceptJob = async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  if (!shipment)
    return res.status(404).json({ success: false, message: 'Not found' });
  if (shipment.driver?.toString() !== req.user._id.toString())
    return res.status(403).json({ success: false, message: 'Not assigned' });
  if (shipment.status !== 'pending')
    return res
      .status(400)
      .json({ success: false, message: 'Job is no longer pending' });
  shipment.status = 'picked_up';
  shipment.history.push({
    status: 'picked_up',
    location: 'Accepted by driver',
    updatedBy: req.user._id,
  });
  await shipment.save();
  res.json({ success: true, shipment });
};

export const declineJob = async (req, res) => {
  const reason = typeof req.body.reason === 'string' ? req.body.reason.trim() : '';
  if (!reason || reason.length > 250)
    return res.status(400).json({
      success: false,
      message: 'A decline reason of 1 to 250 characters is required',
    });

  const shipment = await Shipment.findOneAndUpdate(
    { _id: req.params.id, driver: req.user._id, status: 'pending' },
    {
      $set: { driver: null },
      $push: { declines: { driver: req.user._id, reason } },
    },
    { new: true },
  );
  if (!shipment)
    return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, shipment });
};

export const updateDriverLocation = async (req, res) => {
  try {
    const { lat, lng, isOnline } = req.body;
    if (isOnline === false) {
      await User.findByIdAndUpdate(req.user._id, {
        isOnline: false,
        lastLocationAt: new Date(),
      });
      return res.json({ success: true, isOnline: false });
    }
    if (
      !Number.isFinite(Number(lat)) ||
      !Number.isFinite(Number(lng)) ||
      Number(lat) < -90 ||
      Number(lat) > 90 ||
      Number(lng) < -180 ||
      Number(lng) > 180
    )
      return res.status(400).json({
        success: false,
        message: 'Valid latitude and longitude required',
      });
    const now = new Date();
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        lastLocation: { lat: Number(lat), lng: Number(lng), updatedAt: now },
        lastLocationAt: now,
        isOnline: true,
      },
      { new: true },
    );
    res.json({
      success: true,
      lastLocationAt: updated.lastLocationAt,
      isOnline: updated.isOnline,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Could not update location' });
  }
};

export const updateJobStatus = async (req, res) => {
  const { status } = req.body;
  const shipment = await Shipment.findOne({
    _id: req.params.id,
    driver: req.user._id,
  });
  if (!shipment)
    return res.status(404).json({ success: false, message: 'Job not found' });
  const allowedTransitions = {
    pending: ['picked_up'],
    picked_up: ['in_transit'],
    in_transit: ['out_for_delivery'],
  };
  if (!allowedTransitions[shipment.status]?.includes(status))
    return res.status(400).json({
      success: false,
      message:
        status === 'delivered'
          ? 'Verify OTP before delivered'
          : `Cannot move from ${shipment.status} to ${status}`,
    });
  shipment.status = status;
  shipment.history.push({
    status,
    location: shipment.currentLocation,
    updatedBy: req.user._id,
  });
  await shipment.save();
  res.json({ success: true, shipment });
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp)
      return res.status(400).json({ success: false, message: 'OTP required' });
    const shipment = await Shipment.findById(req.params.id).select(
      '+deliveryOtpHash +otpExpiresAt +otpAttempts',
    );
    if (!shipment)
      return res
        .status(404)
        .json({ success: false, message: 'Shipment not found' });
    if (shipment.driver?.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not assigned' });
    if (shipment.status !== 'out_for_delivery')
      return res
        .status(400)
        .json({ success: false, message: 'Not out for delivery' });
    if (!shipment.deliveryOtpHash)
      return res.status(400).json({ success: false, message: 'No OTP' });
    if (shipment.otpAttempts >= 3)
      return res
        .status(403)
        .json({ success: false, message: 'Too many attempts' });
    if (shipment.otpExpiresAt && shipment.otpExpiresAt < new Date())
      return res.status(400).json({ success: false, message: 'OTP expired' });
    const isMatch = await bcrypt.compare(otp, shipment.deliveryOtpHash);
    if (!isMatch) {
      shipment.otpAttempts += 1;
      await shipment.save();
      return res.status(400).json({
        success: false,
        message: `Wrong OTP. ${3 - shipment.otpAttempts} left`,
      });
    }
    shipment.status = 'delivered';
    shipment.otpVerified = true;
    shipment.deliveryOtpHash = undefined;
    shipment.otpExpiresAt = undefined;
    shipment.otpAttempts = 0;
    shipment.history.push({
      status: 'delivered',
      location: `Delivered at ${shipment.deliveryAddress}`,
      updatedBy: req.user._id,
    });
    await shipment.save();
    res.json({ success: true, message: 'Delivered', shipment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const applyAsDriver = async (req, res) => {
  let documents = [];
  try {
    const { name, email, phone, city, bikeStatus, experience } = req.body;
    if (!name?.trim() || !email?.trim() || !phone?.trim())
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required',
      });
    documents = await uploadApplicationDocuments(req.files);
    const application = await DriverApplication.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city,
      bikeStatus,
      experience,
      documents,
    });
    res.status(201).json({ success: true, application });
  } catch (err) {
    console.error('DRIVER APPLICATION SUBMISSION ERROR:', err);
    if (documents.length) await deleteApplicationDocuments(documents);
    res.status(500).json({
      success: false,
      message:
        err.message.startsWith('Supabase storage is not configured')
          ? err.message
          : 'Could not submit application',
    });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await DriverApplication.find()
      .sort('-createdAt')
      .lean();
    res.json({
      success: true,
      applications: await Promise.all(
        applications.map(async (application) => ({
          ...application,
          documents: await Promise.all(
            (application.documents || []).map(async (document) => ({
              field: document.field,
              originalName: document.originalName,
              format: document.format,
              bytes: document.bytes,
              downloadUrl:
                await getApplicationDocumentDownloadUrl(document),
            })),
          ),
        })),
      ),
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Could not load applications' });
  }
};

export const acceptDriverApplication = async (req, res) => {
  const session = await mongoose.startSession();
  let transactionStarted = false;
  let transactionCommitted = false;
  try {
    session.startTransaction();
    transactionStarted = true;
    const application = await DriverApplication.findById(req.params.id).session(
      session,
    );
    if (!application) {
      await session.abortTransaction();
      transactionStarted = false;
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    if (application.status !== 'pending') {
      await session.abortTransaction();
      transactionStarted = false;
      return res
        .status(400)
        .json({ success: false, message: `Already ${application.status}` });
    }
    if (await User.exists({ email: application.email }).session(session)) {
      await session.abortTransaction();
      transactionStarted = false;
      return res.status(409).json({ success: false, message: 'Email exists' });
    }
    const passportPhoto = application.documents?.find(
      (doc) =>
        doc.field === 'passportPhoto' &&
        ['jpg', 'jpeg', 'png'].includes(doc.format?.toLowerCase()),
    );
    const tempPassword = `${randomBytes(9).toString('base64url')}G71!`;
    const driver = await User.create(
      [
        {
          name: application.name,
          email: application.email,
          phone: application.phone,
          city: application.city,
          bikeStatus: application.bikeStatus,
          experience: application.experience,
          avatarPublicId: passportPhoto?.publicId || '',
          avatarFormat: passportPhoto?.format || '',
          avatarResourceType: passportPhoto?.resourceType || 'image',
          avatarUrl: '',
          avatarIsPublic: false,
          password: tempPassword,
          role: 'driver',
          mustChangePassword: true,
        },
      ],
      { session },
    );
    application.status = 'accepted';
    await application.save({ session });
    await session.commitTransaction();
    transactionCommitted = true;
    transactionStarted = false;

    let avatarUrl = '';
    if (passportPhoto) {
      try {
        avatarUrl = await getApplicationDocumentViewUrl(passportPhoto);
      } catch (storageError) {
        console.error(
          'APPROVED DRIVER AVATAR URL ERROR:',
          storageError.message,
        );
      }
    }

    const emailResult = await sendDriverWelcomeEmail({
      to: application.email,
      name: application.name,
      email: application.email,
      tempPassword,
      loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
    });
    res.json({
      success: true,
      message: emailResult.success
        ? `Approved + email sent to ${application.email}`
        : 'Approved but email failed',
      emailSent: emailResult.success,
      ...(!emailResult.success && { temporaryPassword: tempPassword }),
      driver: {
        ...driver[0].toObject(),
        avatarUrl,
      },
    });
  } catch (err) {
    if (transactionStarted && !transactionCommitted) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('DRIVER APPLICATION TRANSACTION ABORT ERROR:', abortError);
      }
    }
    console.error('DRIVER APPLICATION APPROVAL ERROR:', err);
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === 'production'
          ? 'Could not approve application'
          : err.message || 'Could not approve application',
    });
  } finally {
    session.endSession();
  }
};

export const rejectDriverApplication = async (req, res) => {
  try {
    const app = await DriverApplication.findById(req.params.id);
    if (!app)
      return res.status(404).json({ success: false, message: 'Not found' });
    if (app.status !== 'pending')
      return res
        .status(400)
        .json({ success: false, message: `Already ${app.status}` });
    app.status = 'rejected';
    await app.save();
    res.json({ success: true, application: app });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not reject' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Required' });
    const driver = await User.findById(req.user._id).select('+password');
    if (!driver)
      return res
        .status(404)
        .json({ success: false, message: 'Account not found' });
    if (newPassword.length < 8)
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      });
    if (currentPassword === newPassword)
      return res
        .status(400)
        .json({ success: false, message: 'Choose a different password' });
    const matches = await bcrypt.compare(currentPassword, driver.password);
    if (!matches)
      return res
        .status(401)
        .json({ success: false, message: 'Wrong password' });
    driver.password = newPassword;
    driver.mustChangePassword = false;
    await driver.save();
    res.json({ success: true, message: 'Password changed' });
  } catch (err) {
    console.error('CHANGE PASSWORD ERROR:', err);
    res
      .status(500)
      .json({ success: false, message: 'Could not change password' });
  }
};
