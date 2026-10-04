import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';

const shipmentHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        'pending',
        'picked_up',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      required: true,
    },
    location: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const shipmentDeclineSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: 'declinedAt', updatedAt: false } },
);

const shipmentSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      unique: true,
      default: () => `G71-${randomBytes(5).toString('hex').toUpperCase()}`,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    guestInfo: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    customerName: { type: String, select: false },
    customerEmail: { type: String, lowercase: true, select: false },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    senderName: String,
    receiverName: String,
    receiverPhone: String,
    pickupAddress: String,
    deliveryAddress: String,
    packageDescription: String,
    weight: { type: Number, default: 1 },

    // PHASE 19 - PRICING
    price: { type: Number, default: 2500 },
    driverEarning: { type: Number, default: 500 },
    distanceKm: { type: Number, default: 0 },
    rate: { type: mongoose.Schema.Types.ObjectId, ref: 'Rate' },

    status: {
      type: String,
      enum: [
        'pending',
        'picked_up',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    currentLocation: { type: String, default: '' },
    estimatedDelivery: { type: Date },

    deliveryOtpHash: { type: String, select: false },
    otpExpiresAt: { type: Date, select: false },
    otpAttempts: { type: Number, default: 0 },
    otpResendCount: { type: Number, default: 0 },
    lastOtpSentAt: { type: Date },
    otpVerified: { type: Boolean, default: false },

    history: { type: [shipmentHistorySchema], default: [] },
    declines: { type: [shipmentDeclineSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model('Shipment', shipmentSchema);
