import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface ICompletedClass extends Document {
  courseId: mongoose.Schema.Types.ObjectId;
  teacherId: mongoose.Schema.Types.ObjectId;
  studentId: mongoose.Schema.Types.ObjectId;
  topic: string;
  duration?: number; // Duration in minutes
  homeworkAssigned?: string;
  homeworkFile?: string;
  completedAt: Date;
}

const CompletedClassSchema: Schema<ICompletedClass> = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  duration: { type: Number }, // Optional: duration in minutes
  homeworkAssigned: { type: String }, // Optional: details about homework
  homeworkFile: { type: String },
  completedAt: { type: Date, default: Date.now, required: true },
}, { timestamps: true });

const CompletedClass: Model<ICompletedClass> = models.CompletedClass || mongoose.model<ICompletedClass>("CompletedClass", CompletedClassSchema);

export default CompletedClass;
