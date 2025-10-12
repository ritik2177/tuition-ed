import mongoose, { Schema, Document, models, Model } from 'mongoose';

/**
 * Interface representing a User document in MongoDB.
 */
export interface IUser extends Document {
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
  role: 'student' | 'teacher' | 'admin';
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
}, { timestamps: true }); // `timestamps` adds `createdAt` and `updatedAt` fields

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
