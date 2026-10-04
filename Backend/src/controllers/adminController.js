import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import DriverApplication from '../models/driverApplication.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Shipment from '../models/shipment.js';
import User from '../models/user.js';
import { calculatePrice } from './rateController.js';
import {
  sendDriverWelcomeEmail,
  sendTrackingCodeEmail,
} from '../utils/sendEmail.js';
import {
  deleteDriverAvatar,
  getApplicationDocumentDownloadUrl,
  getApplicationDocumentViewUrl,
  getDriverAvatarUrl,
  uploadDriverAvatar,
} from '../services/supabaseStorageService.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -avatarPublicId -avatarFormat -avatarResourceType')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createDriver = async (req, res) => {
  let uploadedAvatar;
  let uploadedAvatarUrl;
  let avatarUploadFailed = false;
  try {
    const { name, email, phone, city, bikeStatus, experience } = req.body;
    if (!name?.trim() || !email?.trim() || !phone?.trim())
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required',
      });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail }))
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    if (req.file) {
      try {
        uploadedAvatar = await uploadDriverAvatar(req.file);
        uploadedAvatarUrl = await getDriverAvatarUrl(uploadedAvatar.publicId);
      } catch (uploadError) {
        if (uploadedAvatar) {
          try {
            await deleteDriverAvatar(uploadedAvatar.publicId);
          } catch (cleanupError) {
            console.error('DRIVER AVATAR CLEANUP ERROR:', cleanupError);
          }
          uploadedAvatar = undefined;
        }
        avatarUploadFailed = true;
        console.error(
          'DRIVER AVATAR UPLOAD ERROR:',
          uploadError.http_code || uploadError.message,
        );
      }
    }
    const temporaryPassword = `${randomBytes(9).toString('base64url')}G71!`;
    const driver = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      city,
      bikeStatus,
      experience,
      password: temporaryPassword,
      role: 'driver',
      mustChangePassword: true,
      avatarPublicId: uploadedAvatar?.publicId || '',
      avatarFormat: uploadedAvatar?.format || '',
      avatarResourceType: uploadedAvatar?.resourceType || 'image',
      avatarUrl: '',
      avatarIsPublic: false,
    });
    const avatarUrl = uploadedAvatarUrl || null;
    const emailResult = await sendDriverWelcomeEmail({
      to: driver.email,
      name: driver.name,
      email: driver.email,
      tempPassword: temporaryPassword,
      loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
    });
    res.status(201).json({
      success: true,
      message: [
        emailResult.success
          ? `Driver created and welcome email sent to ${driver.email}`
          : 'Driver created, but welcome email failed.',
        avatarUploadFailed
          ? 'Supabase Storage rejected the profile photo; the driver was created without it.'
          : '',
      ]
        .filter(Boolean)
        .join(' '),
      emailSent: emailResult.success,
      avatarUploadFailed,
      ...(emailResult.success ? {} : { temporaryPassword }),
      user: {
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        role: driver.role,
        city: driver.city,
        isActive: driver.isActive,
        avatarUrl,
      },
    });
  } catch (err) {
    if (uploadedAvatar) {
      try {
        await deleteDriverAvatar(uploadedAvatar.publicId);
      } catch (cleanupError) {
        console.error('DRIVER AVATAR CLEANUP ERROR:', cleanupError);
      }
    }
    console.error('CREATE DRIVER ERROR:', err.message);
    res
      .status(500)
      .json({ success: false, message: 'Could not create driver' });
  }
};

export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role }).select(
      '-password -avatarPublicId -avatarFormat -avatarResourceType',
    );
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDriverProfile = async (req, res) => {
  try {
    const driver = await User.findOne({ _id: req.params.id, role: 'driver' })
      .select('-password')
      .lean();
    if (!driver)
      return res
        .status(404)
        .json({ success: false, message: 'Driver not found' });
    const { avatarPublicId, avatarFormat, avatarResourceType, ...profile } =
      driver;
    let avatarUrl =
      profile.avatarIsPublic && profile.avatarUrl ? profile.avatarUrl : null;
    if (!avatarUrl && avatarPublicId) {
      try {
        avatarUrl = await getApplicationDocumentViewUrl({
          publicId: avatarPublicId,
          format: avatarFormat,
          resourceType: avatarResourceType,
        });
      } catch (err) {
        console.error('DRIVER AVATAR URL ERROR:', err.message);
      }
    }
    res.json({ success: true, user: { ...profile, avatarUrl } });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Could not load driver profile' });
  }
};

// PHASE 22 FINAL - ATOMIC CASCADE
export const deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'User not found' });
    }
    if (userId.toString() === req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    if (user.role === 'driver') {
      await Shipment.updateMany(
        {
          driver: userId,
          status: {
            $in: ['pending', 'picked_up', 'in_transit', 'out_for_delivery'],
          },
        },
        {
          $set: { driver: null, status: 'pending' },
          $push: {
            history: {
              status: 'pending',
              location: `Driver ${user.name} deleted - returned to pool`,
              updatedBy: req.user._id,
            },
          },
        },
        { session },
      );
    }

    if (user.role === 'client') {
      await Shipment.updateMany(
        { client: userId },
        {
          $set: {
            client: null,
            guestInfo: {
              name: user.name,
              email: user.email,
              phone: user.phone || '',
            },
          },
        },
        { session },
      );
      await ServiceRequest.updateMany(
        { user: userId },
        { $set: { user: null } },
        { session },
      );
    }

    await User.findByIdAndDelete(userId).session(session);
    await session.commitTransaction();
    res.json({
      success: true,
      message: `${user.role} deleted, ${user.role === 'driver' ? 'active jobs returned to pending' : 'shipments preserved as guest'}`,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('DELETE USER ERROR:', err.message);
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort('-createdAt');
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const approveRequest = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const request = await ServiceRequest.findById(req.params.id).session(
      session,
    );
    if (!request) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    if (request.status !== 'pending') {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: `Already ${request.status}` });
    }
    if (request.shipment) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: 'Already approved' });
    }
    const { price, driverEarning, rateId } = await calculatePrice(
      request.packageWeight || 1,
      0,
    );
    const isGuest = !request.user && !request.client;
    const shipmentPayload = {
      trackingId: request.trackingCode,
      price,
      driverEarning,
      rate: rateId,
      senderName: request.guestName,
      receiverName: request.receiverName || request.guestName,
      receiverPhone: request.receiverPhone || request.guestPhone,
      pickupAddress: request.pickupAddress,
      deliveryAddress: request.dropoffAddress,
      packageDescription: `${request.packageType} - ${request.description || ''}`,
      weight: request.packageWeight || 1,
      status: 'pending',
      history: [
        {
          status: 'pending',
          location: `Request ${request.trackingCode} approved at Lagos Hub`,
          updatedBy: req.user._id,
        },
      ],
    };
    if (isGuest) {
      shipmentPayload.client = null;
      shipmentPayload.guestInfo = {
        name: request.guestName || '',
        email: request.guestEmail || '',
        phone: request.guestPhone || '',
      };
      shipmentPayload.customerName = request.guestName;
      shipmentPayload.customerEmail = request.guestEmail;
    } else {
      shipmentPayload.client = request.user || request.client;
      shipmentPayload.customerName = request.guestName;
      shipmentPayload.customerEmail = request.guestEmail;
    }
    const [shipment] = await Shipment.create([shipmentPayload], { session });
    request.status = 'approved';
    request.shipment = shipment._id;
    await request.save({ session });
    await session.commitTransaction();
    const emailResult = await sendTrackingCodeEmail({
      to: request.senderEmail || request.guestEmail,
      name: request.senderName || request.guestName,
      trackingCode: shipment.trackingId,
      price,
    });
    res.json({
      success: true,
      message: emailResult.success
        ? `Approved. Tracking code emailed. Price: ₦${price}`
        : 'Approved, but the tracking email could not be sent.',
      emailSent: emailResult.success,
      shipment,
      trackingCode: request.trackingCode,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('APPROVE ERROR:', err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true },
    );
    if (!request)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const [shipmentStats, requestStats, totalDrivers, totalClients] =
      await Promise.all([
        Shipment.aggregate([
          {
            $facet: {
              summary: [
                {
                  $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: {
                      $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
                    },
                    picked: {
                      $sum: {
                        $cond: [{ $eq: ['$status', 'picked_up'] }, 1, 0],
                      },
                    },
                    inTransit: {
                      $sum: {
                        $cond: [{ $eq: ['$status', 'in_transit'] }, 1, 0],
                      },
                    },
                    outForDelivery: {
                      $sum: {
                        $cond: [{ $eq: ['$status', 'out_for_delivery'] }, 1, 0],
                      },
                    },
                    delivered: {
                      $sum: {
                        $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0],
                      },
                    },
                    cancelled: {
                      $sum: {
                        $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0],
                      },
                    },
                    revenue: {
                      $sum: {
                        $cond: [
                          { $eq: ['$status', 'delivered'] },
                          '$price',
                          0,
                        ],
                      },
                    },
                    payout: {
                      $sum: {
                        $cond: [
                          { $eq: ['$status', 'delivered'] },
                          '$driverEarning',
                          0,
                        ],
                      },
                    },
                  },
                },
              ],
              daily: [
                { $match: { createdAt: { $gte: sevenDaysAgo } } },
                {
                  $group: {
                    _id: {
                      $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$createdAt',
                      },
                    },
                    count: { $sum: 1 },
                    delivered: {
                      $sum: {
                        $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0],
                      },
                    },
                    revenue: {
                      $sum: {
                        $cond: [
                          { $eq: ['$status', 'delivered'] },
                          '$price',
                          0,
                        ],
                      },
                    },
                  },
                },
                { $sort: { _id: 1 } },
              ],
            },
          },
        ]),
        ServiceRequest.aggregate([
          { $match: { status: 'pending' } },
          {
            $facet: {
              count: [{ $count: 'total' }],
              recent: [
                { $sort: { createdAt: -1 } },
                { $limit: 3 },
                {
                  $project: {
                    trackingCode: 1,
                    pickupAddress: 1,
                    dropoffAddress: 1,
                    status: 1,
                    createdAt: 1,
                  },
                },
              ],
            },
          },
        ]),
        User.countDocuments({ role: 'driver', isActive: true }),
        User.countDocuments({ role: 'client' }),
      ]);

    const summary = shipmentStats[0]?.summary[0] || {};
    const requests = requestStats[0]?.count[0]?.total || 0;
    const revenue = summary.revenue || 0;
    const payout = summary.payout || 0;
    const dailyStats = shipmentStats[0]?.daily || [];
    res.json({
      success: true,
      stats: {
        total: summary.total || 0,
        pending: summary.pending || 0,
        picked: summary.picked || 0,
        inTransit: summary.inTransit || 0,
        outForDelivery: summary.outForDelivery || 0,
        delivered: summary.delivered || 0,
        cancelled: summary.cancelled || 0,
        requests,
        totalDrivers,
        totalClients,
        revenue,
        payout,
        profit: revenue - payout,
      },
      chart: dailyStats,
      recentRequests: requestStats[0]?.recent || [],
    });
  } catch (err) {
    console.error('ADMIN STATS ERROR:', err);
    const isDatabaseUnavailable =
      err.name?.startsWith('MongoNetwork') ||
      err.name === 'MongoServerSelectionError';
    res.status(isDatabaseUnavailable ? 503 : 500).json({
      message: isDatabaseUnavailable
        ? 'Dashboard data is temporarily unavailable. Please try again shortly.'
        : 'Could not load dashboard data.',
    });
  }
};

export const getDriverPerformance = async (req, res) => {
  try {
    const [drivers, shipmentPerformance] = await Promise.all([
      User.find({ role: 'driver' })
        .select('name email isActive')
        .lean(),
      Shipment.aggregate([
        { $match: { driver: { $type: 'objectId' } } },
        {
          $project: {
            driver: 1,
            status: 1,
            createdAt: 1,
            estimatedDelivery: 1,
            deliveredAt: {
              $let: {
                vars: {
                  deliveredHistory: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$history',
                          as: 'event',
                          cond: { $eq: ['$$event.status', 'delivered'] },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: '$$deliveredHistory.createdAt',
              },
            },
          },
        },
        {
          $group: {
            _id: '$driver',
            totalJobs: { $sum: 1 },
            delivered: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
            },
            totalEarnings: {
              $sum: {
                $cond: [
                  { $eq: ['$status', 'delivered'] },
                  { $ifNull: ['$driverEarning', 0] },
                  0,
                ],
              },
            },
            averageDurationMs: {
              $avg: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$status', 'delivered'] },
                      { $ne: ['$deliveredAt', null] },
                    ],
                  },
                  { $subtract: ['$deliveredAt', '$createdAt'] },
                  null,
                ],
              },
            },
            onTimeEligible: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$status', 'delivered'] },
                      { $ne: ['$estimatedDelivery', null] },
                      { $ne: ['$deliveredAt', null] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            onTimeDeliveries: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$status', 'delivered'] },
                      { $ne: ['$estimatedDelivery', null] },
                      { $ne: ['$deliveredAt', null] },
                      { $lte: ['$deliveredAt', '$estimatedDelivery'] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            driverId: '$_id',
            totalJobs: 1,
            delivered: 1,
            cancelled: 1,
            totalEarnings: 1,
            averageDeliveryMinutes: {
              $cond: [
                { $gt: ['$delivered', 0] },
                {
                  $round: [
                    { $divide: ['$averageDurationMs', 60_000] },
                    1,
                  ],
                },
                null,
              ],
            },
            onTimeRate: {
              $cond: [
                { $gt: ['$onTimeEligible', 0] },
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ['$onTimeDeliveries', '$onTimeEligible'] },
                        100,
                      ],
                    },
                    1,
                  ],
                },
                null,
              ],
            },
          },
        },
      ]),
    ]);

    const performanceByDriver = new Map(
      shipmentPerformance.map((performance) => [
        performance.driverId.toString(),
        performance,
      ]),
    );
    const performance = drivers
      .map((driver) => {
        const metrics = performanceByDriver.get(driver._id.toString());
        return {
          _id: driver._id,
          name: driver.name,
          email: driver.email,
          isActive: driver.isActive,
          totalJobs: metrics?.totalJobs || 0,
          delivered: metrics?.delivered || 0,
          cancelled: metrics?.cancelled || 0,
          totalEarnings: metrics?.totalEarnings || 0,
          averageDeliveryMinutes: metrics?.averageDeliveryMinutes ?? null,
          onTimeRate: metrics?.onTimeRate ?? null,
          cancellationRate: metrics?.totalJobs
            ? Number(((metrics.cancelled / metrics.totalJobs) * 100).toFixed(1))
            : 0,
        };
      })
      .sort((a, b) => b.delivered - a.delivered || a.name.localeCompare(b.name));

    res.json({ success: true, performance });
  } catch (err) {
    console.error('DRIVER PERFORMANCE ERROR:', err);
    res.status(500).json({
      success: false,
      message: 'Could not load driver performance',
    });
  }
};

export const getLiveDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver', isActive: true }).select(
      'name email phone lastLocation isOnline lastLocationAt',
    );
    const mappedDrivers = drivers.map((d) => {
      const obj = d.toObject();
      const lastSeen = obj.lastLocationAt
        ? new Date(obj.lastLocationAt).getTime()
        : 0;
      const stale = Date.now() - lastSeen > 2 * 60 * 1000;
      return { ...obj, isOnline: obj.isOnline && !stale, isStale: stale };
    });
    const activeShipments = await Shipment.find({
      status: { $in: ['picked_up', 'in_transit', 'out_for_delivery'] },
    });
    const mapped = mappedDrivers.map((driver) => ({
      ...driver,
      activeJob: activeShipments.find(
        (s) => s.driver?.toString() === driver._id.toString(),
      ),
    }));
    res.json({ success: true, drivers: mapped });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const serializeDriverApplication = async (application) => {
  let avatarUrl = null;
  const documents = await Promise.all(
    (application.documents || []).map(async (document) => {
      const downloadUrl = await getApplicationDocumentDownloadUrl(document);
      if (
        document.field === 'passportPhoto' &&
        ['jpg', 'jpeg', 'png'].includes(document.format?.toLowerCase())
      )
        avatarUrl = await getApplicationDocumentViewUrl(document);
      return { ...document, downloadUrl, signedUrl: downloadUrl };
    }),
  );
  return { ...application, documents, avatarUrl };
};

export const getDriverApplications = async (req, res) => {
  try {
    const applications = await DriverApplication.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json({
      success: true,
      applications: await Promise.all(
        applications.map(serializeDriverApplication),
      ),
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Could not load applications' });
  }
};

export const getSingleDriverApplication = async (req, res) => {
  try {
    const application = await DriverApplication.findById(req.params.id).lean();
    if (!application)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.json({
      success: true,
      application: await serializeDriverApplication(application),
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Could not load application' });
  }
};
