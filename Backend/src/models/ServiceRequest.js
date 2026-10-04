import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';

const serviceRequestSchema = new mongoose.Schema(
  {
    trackingCode: { type: String, unique: true, index: true },

    // Sender (guest)
    senderName: { type: String, required: true },
    guestName: { type: String }, // keep for backward compat
    senderPhone: { type: String, required: true },
    guestPhone: { type: String },
    senderEmail: { type: String, required: true },
    guestEmail: { type: String },

    pickupAddress: { type: String, required: true },
    pickup: { type: String }, // alias
    dropoffAddress: { type: String, required: true },
    dropoff: { type: String }, // alias

    receiverName: { type: String, required: true },
    receiverPhone: { type: String, required: true },

    // Package
    packageType: { type: String, required: true },
    weight: { type: Number },
    packageWeight: { type: Number },
    note: { type: String },
    description: { type: String },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment' },
  },
  { timestamps: true },
);

serviceRequestSchema.pre('save', function (next) {
  if (!this.trackingCode) {
    this.trackingCode = `G71-${randomBytes(5).toString('hex').toUpperCase()}`;
  }
  // sync aliases so both old and new queries work
  if (this.senderName && !this.guestName) this.guestName = this.senderName;
  if (this.senderPhone && !this.guestPhone) this.guestPhone = this.senderPhone;
  if (this.senderEmail && !this.guestEmail) this.guestEmail = this.senderEmail;
  if (this.pickup && !this.pickupAddress) this.pickupAddress = this.pickup;
  if (this.dropoff && !this.dropoffAddress) this.dropoffAddress = this.dropoff;
  if (this.weight && !this.packageWeight) this.packageWeight = this.weight;
  if (this.note && !this.description) this.description = this.note;
  next();
});

export default mongoose.model('ServiceRequest', serviceRequestSchema);
