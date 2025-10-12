import mongoose, { Schema, Document, models, Model } from 'mongoose';

/**
 * Interface representing a Student document in MongoDB.
 */
export interface IStudent extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  fullName: string;
  email: string;
  mobile?: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
  };
  profilePicture?: string;
  
  otp?: string;
  otpExpires?: Date;
  isVerified: boolean;
}

const StudentSchema: Schema<IStudent> = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  dateOfBirth: { type: Date },
  address: {
    street: String,
    city: String,
    state: String,
  },
  profilePicture: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true }); // `timestamps` adds `createdAt` and `updatedAt` fields

const Student: Model<IStudent> = models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
