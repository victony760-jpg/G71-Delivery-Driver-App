import mongoose from 'mongoose';
const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String, required: true, select: false },
    role: { type: String, default: 'driver' },
    mustChangePassword: { type: Boolean, default: true },
    status: { type: String, default: 'active' },
  },
  { timestamps: true },
);
export default mongoose.model('Driver', driverSchema);
