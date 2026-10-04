import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'driver', 'client'],
      default: 'client',
    },
    phone: { type: String },
    city: { type: String, default: '' },
    bikeStatus: { type: String, default: '' },
    experience: { type: String, default: '' },
    avatarPublicId: { type: String, default: '' },
    avatarFormat: { type: String, default: '' },
    avatarResourceType: { type: String, default: 'image' },
    avatarUrl: { type: String, default: '' }, // PHASE 16 ADD for direct URL
    avatarIsPublic: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: false },
    lastLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
    lastLocationAt: { type: Date }, // PHASE 16 ADD - heartbeat
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
