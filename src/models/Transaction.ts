import mongoose, { Schema, Document, Model, models } from "mongoose";

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  transactionId: string;
  amount: number;
  numberOfClasses: number;
  currency: string;
  paymentStatus: "pending" | "completed" | "failed";
  paymentGateway?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    numberOfClasses: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
    },
    paymentGateway: { type: String },
  },
  { timestamps: true }
);

const Transaction: Model<ITransaction> = models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;