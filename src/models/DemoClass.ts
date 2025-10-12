import mongoose, { Schema, Document, Model, models } from 'mongoose';

/**
 * Interface representing a DemoClass document in MongoDB.
 */
export interface IDemoClass extends Document {
  studentName: string;
  parentName: string;
  email: string;
  mobile?: string;
  grade: string;
  subject: string;
  otherSubject?: string;
  demoTopic?: string;
  city: string;
  country:string;
  demoTime: Date;
  comment?: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  studentId?: Schema.Types.ObjectId; // Optional reference to a Student
  createdAt: Date;
  updatedAt: Date;
}

const DemoClassSchema: Schema<IDemoClass> = new Schema({
  studentName: { type: String, required: true },
  parentName: { type: String, required: true },
  email: { type: String, required: true }, // From a logged-in user or form
  mobile: { type: String }, // From a logged-in user or form
  grade: { type: String, required: true },
  subject: { type: String, required: true },
  otherSubject: { type: String },
  demoTopic: { type: String },
  city: { type: String, required: true },
  country: { type: String, required: true },
  demoTime: { type: Date, required: true },
  comment: { type: String },
  status: {
    type: String,
    enum: ['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
  },
}, {
  timestamps: true, // This adds `createdAt` and `updatedAt` fields
});

// Prevent model recompilation in Next.js hot-reloading environments
const DemoClass: Model<IDemoClass> = models.DemoClass || mongoose.model<IDemoClass>('DemoClass', DemoClassSchema);

export default DemoClass;