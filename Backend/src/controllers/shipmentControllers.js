import mongoose from 'mongoose';
import Shipment from '../models/shipment.js';
import User from '../models/user.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '../utils/sendEmail.js';
import { calculatePrice } from './rateController.js';
import { buildShipmentDocument } from '../utils/shipmentFactory.js';
import {
  approximateCoordinates,
  maskTrackingLocation,
} from '../utils/publicTracking.js';

const STATUS_FLOW = {
  pending: ['picked_up', 'cancelled'],
  picked_up: ['in_transit', 'cancelled'],
  in_transit: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const canAccessShipment = (shipment, user) => {
  const userId = (user._id || user.id).toString();
  if (user.role === 'admin') return true;
  if (user.role === 'client') {
    const clientId = shipment.client?._id
      ? shipment.client._id.toString()
      : shipment.client?.toString();
    if (clientId === userId) return true;
  }
  if (user.role === 'driver') {
    const driverId = shipment.driver?._id
      ? shipment.driver._id.toString()
      : shipment.driver?.toString();
    if (driverId === userId) return true;
  }
  return false;
};

export const createShipment = async (req, res) => {
  try {
    const weight = Number(req.body.weight);
    const normalizedWeight = Number.isFinite(weight) && weight > 0 ? weight : 1;
    const pricing = await calculatePrice(normalizedWeight, 0);
    const shipment = await Shipment.create(
      buildShipmentDocument({
        input: req.body,
        user: req.user,
        pricing,
      }),
    );
    res.status(201).json({ success: true, shipment });
  } catch (err) {
    console.error('CREATE SHIPMENT ERROR:', err);
    res
      .status(500)
      .json({ success: false, message: 'Could not create shipment' });
  }
};

export const getShipments = async (req, res) => {
  try {
    let filter = {};
    const userId = req.user._id || req.user.id;
    if (req.user.role === 'client') filter.client = userId;
    if (req.user.role === 'driver') filter.driver = userId;
    const shipments = await Shipment.find(filter)
      .populate('client', 'name email phone')
      .populate('driver', 'name email phone')
      .populate('assignedBy', 'name')
      .populate('history.updatedBy', 'name role')
      .populate('declines.driver', 'name')
      .sort('-createdAt');
    res.json({ success: true, count: shipments.length, shipments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const q = id.length === 24 ? { _id: id } : { trackingId: id };
    const shipment = await Shipment.findOne(q)
      .populate('client', 'name email phone')
      .populate('driver', 'name email phone')
      .populate('assignedBy', 'name')
      .populate('history.updatedBy', 'name role')
      .populate('declines.driver', 'name');
    if (!shipment)
      return res.status(404).json({ success: false, message: 'Not found' });
    if (!canAccessShipment(shipment, req.user))
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized' });
    res.json({ success: true, shipment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PHASE 23 - PUBLIC TRACKING - ZERO PII
export const trackShipment = async (req, res) => {
  try {
    const code = req.params.trackingId.toUpperCase().trim();
    const ServiceRequest = (await import('../models/ServiceRequest.js'))
      .default;

    let request = await ServiceRequest.findOne({ trackingCode: code }).lean();
    let shipment = await Shipment.findOne({ trackingId: code })
      .select(
        'trackingId status pickupAddress deliveryAddress currentLocation packageDescription weight createdAt history driver guestInfo',
      )
      .populate('driver', 'name lastLocation isOnline lastLocationAt')
      .lean();

    if (!shipment && request?.shipment) {
      shipment = await Shipment.findById(request.shipment)
        .select(
          'trackingId status pickupAddress deliveryAddress currentLocation packageDescription weight createdAt history driver',
        )
        .populate('driver', 'name lastLocation isOnline lastLocationAt')
        .lean();
    }

    if (!request && !shipment)
      return res
        .status(404)
        .json({ success: false, message: 'Invalid tracking ID' });

    // Build SAFE driver - no email/phone, only first name + location
    const rawDriver = shipment?.driver;
    let driver = null;
    if (rawDriver) {
      const lastSeen = rawDriver.lastLocationAt || rawDriver.updatedAt;
      const stale = lastSeen
        ? Date.now() - new Date(lastSeen).getTime() > 2 * 60 * 1000
        : true;
      driver = {
        name: rawDriver.name ? rawDriver.name.split(' ')[0] : 'Driver', // first name only
        lastLocation: approximateCoordinates(rawDriver.lastLocation),
        isOnline: rawDriver.isOnline && !stale,
        lastSeen,
      };
    }

    // History - strip updatedBy, only status + location + time
    const history = (shipment?.history || []).map((h) => ({
      status: h.status,
      location: maskTrackingLocation(h.location),
      createdAt: h.createdAt,
    }));

    // Mask addresses - show area only for public
    const publicShipment = shipment
      ? {
          trackingId: shipment.trackingId,
          status: shipment.status,
          pickupAddress: maskTrackingLocation(shipment.pickupAddress),
          deliveryAddress: maskTrackingLocation(shipment.deliveryAddress),
          currentLocation: maskTrackingLocation(shipment.currentLocation),
          packageDescription: shipment.packageDescription,
          weight: shipment.weight,
          driver,
          history,
          createdAt: shipment.createdAt,
        }
      : null;

    // Request - NEVER return emails/phones/names
    let publicRequest = null;
    if (request) {
      publicRequest = {
        trackingCode: request.trackingCode,
        status: request.status,
        packageType: request.packageType,
        pickupAddress: maskTrackingLocation(
          request.pickupAddress || request.dropoffAddress,
        ),
        dropoffAddress: maskTrackingLocation(request.dropoffAddress),
        createdAt: request.createdAt,
        driver,
      };
    }

    res.json({
      success: true,
      trackingId: code,
      status: shipment?.status || request?.status,
      pickupAddress:
        publicShipment?.pickupAddress || publicRequest?.pickupAddress,
      deliveryAddress:
        publicShipment?.deliveryAddress || publicRequest?.dropoffAddress,
      currentLocation:
        publicShipment?.currentLocation || publicRequest?.pickupAddress || '',
      packageDescription:
        publicShipment?.packageDescription || request?.packageType,
      driver,
      history,
      createdAt: shipment?.createdAt || request?.createdAt,
      shipment: publicShipment,
      request: publicRequest,
    });
  } catch (err) {
    console.error('TRACK ERROR', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status, currentLocation } = req.body;
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment)
      return res.status(404).json({ success: false, message: 'Not found' });
    if (
      req.user.role === 'driver' &&
      shipment.driver?.toString() !== (req.user._id || req.user.id).toString()
    )
      return res.status(403).json({ success: false, message: 'Not assigned' });
    if (status === 'delivered')
      return res
        .status(400)
        .json({ success: false, message: 'Use /verify-otp' });
    if (!STATUS_FLOW[shipment.status]?.includes(status))
      return res.status(400).json({
        success: false,
        message: `Cannot move from ${shipment.status} to ${status}`,
      });
    shipment.status = status;
    if (currentLocation) shipment.currentLocation = currentLocation;
    shipment.history.push({
      status,
      location: currentLocation || '',
      updatedBy: req.user._id || req.user.id,
    });
    await shipment.save();
    const pop = await shipment.populate([
      { path: 'client', select: 'name email phone' },
      { path: 'driver', select: 'name email phone' },
      { path: 'history.updatedBy', select: 'name role' },
    ]);
    res.json({ success: true, shipment: pop });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: 'Invalid shipment ID' });
    if (!mongoose.isValidObjectId(driverId))
      return res
        .status(400)
        .json({ success: false, message: 'Valid driver ID required' });
    const driver = await User.findOne({
      _id: driverId,
      role: 'driver',
      isActive: true,
    }).select('_id');
    if (!driver)
      return res
        .status(400)
        .json({ success: false, message: 'Active driver not found' });

    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      { driver: driver._id, assignedBy: req.user._id || req.user.id },
      { new: true, runValidators: true },
    ).populate('driver', 'name email phone');
    if (!shipment)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, shipment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const OTP_EXPIRY = 5 * 60 * 1000;
const RESEND_COOLDOWN = 60 * 1000;
const MAX_ATTEMPTS = 3;

export const generateDeliveryOtp = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate('client', 'name email phone')
      .select('+customerEmail +customerName +guestInfo');
    if (!shipment)
      return res.status(404).json({ success: false, message: 'Not found' });
    const recipientEmail =
      shipment.customerEmail ||
      shipment.guestInfo?.email ||
      shipment.client?.email;
    if (!recipientEmail)
      return res
        .status(400)
        .json({ success: false, message: 'Customer email not available' });
    if (
      req.user.role === 'driver' &&
      shipment.driver?.toString() !== (req.user._id || req.user.id).toString()
    )
      return res.status(403).json({ success: false, message: 'Not assigned' });
    if (shipment.status !== 'out_for_delivery')
      return res
        .status(400)
        .json({ success: false, message: 'Must be out_for_delivery' });
    if (
      shipment.lastOtpSentAt &&
      Date.now() - new Date(shipment.lastOtpSentAt).getTime() < RESEND_COOLDOWN
    ) {
      const wait = Math.ceil(
        (RESEND_COOLDOWN -
          (Date.now() - new Date(shipment.lastOtpSentAt).getTime())) /
          1000,
      );
      return res.status(429).json({ success: false, message: `Wait ${wait}s` });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const hash = await bcrypt.hash(otp, 10);
    shipment.deliveryOtpHash = hash;
    shipment.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY);
    shipment.otpAttempts = 0;
    shipment.otpVerified = false;
    shipment.lastOtpSentAt = new Date();
    shipment.otpResendCount = (shipment.otpResendCount || 0) + 1;
    await shipment.save();
    const emailResult = await sendOtpEmail(
      recipientEmail,
      shipment.customerName ||
        shipment.guestInfo?.name ||
        shipment.client?.name,
      shipment.trackingId,
      otp,
    );
    if (!emailResult.success)
      return res
        .status(502)
        .json({ success: false, message: 'OTP generated but email failed' });
    const isDev = process.env.NODE_ENV !== 'production';
    res.json({
      success: true,
      message: 'OTP emailed',
      ...(isDev && { otp }),
      expiresAt: shipment.otpExpiresAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { otp, currentLocation } = req.body;
    if (!otp)
      return res.status(400).json({ success: false, message: 'OTP required' });
    const shipment = await Shipment.findById(req.params.id).select(
      '+deliveryOtpHash +otpExpiresAt',
    );
    if (!shipment)
      return res.status(404).json({ success: false, message: 'Not found' });
    if (
      req.user.role === 'driver' &&
      shipment.driver?.toString() !== (req.user._id || req.user.id).toString()
    )
      return res.status(403).json({ success: false, message: 'Not assigned' });
    if (!shipment.deliveryOtpHash)
      return res.status(400).json({ success: false, message: 'No OTP' });
    if (shipment.otpExpiresAt < new Date())
      return res.status(400).json({ success: false, message: 'OTP expired' });
    if (shipment.otpAttempts >= MAX_ATTEMPTS)
      return res
        .status(429)
        .json({ success: false, message: 'Too many attempts' });
    if (shipment.otpVerified)
      return res
        .status(400)
        .json({ success: false, message: 'Already delivered' });
    const valid = await bcrypt.compare(otp, shipment.deliveryOtpHash);
    if (!valid) {
      shipment.otpAttempts += 1;
      await shipment.save();
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${MAX_ATTEMPTS - shipment.otpAttempts} left`,
      });
    }
    shipment.status = 'delivered';
    shipment.otpVerified = true;
    shipment.deliveryOtpHash = undefined;
    shipment.otpExpiresAt = undefined;
    shipment.otpAttempts = 0;
    if (currentLocation) shipment.currentLocation = currentLocation;
    shipment.history.push({
      status: 'delivered',
      location: currentLocation || '',
      updatedBy: req.user._id || req.user.id,
    });
    await shipment.save();
    const pop = await shipment.populate([
      { path: 'client', select: 'name email phone' },
      { path: 'driver', select: 'name' },
    ]);
    res.json({ success: true, message: 'Delivery verified!', shipment: pop });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
