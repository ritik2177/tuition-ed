import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from "next-auth";
import { sendEmail } from "@/lib/sendEmail";
import Course from "@/models/Course";


export async function POST(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const user: User = session.user;

  try {
    const { courseId, amount, numberOfClasses, currency, paymentGateway, transactionId } = await request.json();

    if (!courseId || !amount || !numberOfClasses || !transactionId) {
      return NextResponse.json(
        { success: false, message: "Missing required transaction details." },
        { status: 400 }
      );
    }

    const newTransaction = new Transaction({
      userId: new mongoose.Types.ObjectId(user.id),
      courseId: new mongoose.Types.ObjectId(courseId),
      transactionId, // This will be the Razorpay Order ID
      amount,
      numberOfClasses,
      currency: currency || 'INR',
      paymentStatus: 'pending',
      paymentGateway: paymentGateway || 'Razorpay',
    });

    await newTransaction.save();

    return NextResponse.json(
      { success: true, message: "Transaction created successfully.", transaction: newTransaction },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ success: false, message: "Error creating transaction" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    const { transactionId, status } = await request.json();

    if (!transactionId || !status) {
      return NextResponse.json(
        { success: false, message: "Transaction ID and status are required." },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findOne(
      { transactionId: transactionId }
    );

    if (!transaction) {
      return NextResponse.json({ success: false, message: "Transaction not found." }, { status: 404 });
    }

    transaction.paymentStatus = status;
    await transaction.save();

    // If the transaction failed, send an email
    if (status === 'failed' && session.user.email) {
      const course = await Course.findById(transaction.courseId);
      if (course) {
        // Construct a robust base URL that works in production (e.g., on Vercel) and locally.
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
        const paymentUrl = `${baseUrl}/student/courses/${course._id}`;

        await sendEmail({
          to: session.user.email,
          subject: "Payment Failed for Your Course",
          html: `
            <h1>Payment Attempt Failed</h1>
            <p>Hi ${session.user.name || 'Student'},</p>
            <p>Your recent payment attempt for the course "<strong>${course.title}</strong>" did not go through.</p>
            <p>No charges were made. You can try adding classes again by clicking the button below.</p>
            <a href="${paymentUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #4f46e5; text-decoration: none; border-radius: 5px;">
              Retry Payment
            </a>
          `,
        });
      }
    }

    const updatedTransaction = await Transaction.findOne(
      { transactionId: transactionId },
    );

    return NextResponse.json({ success: true, message: "Transaction updated successfully.", transaction: updatedTransaction });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ success: false, message: "Error updating transaction" }, { status: 500 });
  }
}
