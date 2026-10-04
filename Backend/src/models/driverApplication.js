import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    city: { type: String, default: '' },
    bikeStatus: { type: String, default: '' },
    experience: { type: String, default: '' },
    documents: [
      {
        field: {
          type: String,
          enum: ['nin', 'driverLicense', 'guarantorLetter', 'passportPhoto'],
          required: true,
        },
        originalName: { type: String, required: true },
        publicId: { type: String, required: true },
        resourceType: { type: String, required: true },
        format: { type: String, required: true },
        bytes: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);
export default mongoose.model('DriverApplication', schema);
