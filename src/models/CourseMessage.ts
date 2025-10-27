import mongoose, { Schema, Document, models, Model } from "mongoose";

export interface ICourseMessage extends Document {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseMessageSchema: Schema<ICourseMessage> = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const CourseMessage: Model<ICourseMessage> =
  models.CourseMessage || mongoose.model<ICourseMessage>("CourseMessage", CourseMessageSchema);

export default CourseMessage;
