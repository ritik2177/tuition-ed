import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICourse extends Document {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  title: string;
  description: string;
  grade: string;
  classTime: string;
  classDays:  string[];
  noOfClasses: number;
  perClassPrice: number;
  joinLink: string;
  teacherId: Types.ObjectId;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true }, // Renamed from Subject for consistency
  description: { type: String, required: true },
  grade: { type: String, required: true },
  classTime: { type: String },
  classDays: { type: [String] },
  noOfClasses: { type: Number, required: true },
  perClassPrice: { type: Number, required: true },
  joinLink: { type: String },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional teacher assignment
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);