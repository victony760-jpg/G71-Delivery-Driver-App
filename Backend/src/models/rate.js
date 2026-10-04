import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Standard Rate' },
    baseFee: { type: Number, required: true, min: 0, default: 1500 },
    perKgFee: { type: Number, required: true, min: 0, default: 300 },
    perKmFee: { type: Number, min: 0, default: 0 },
    driverShare: { type: Number, min: 0, default: 500 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model('Rate', rateSchema);
