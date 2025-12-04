import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    const { courseId, amount, numberOfClasses, currency, paymentGateway, transactionId } = await request.json();

    if (!courseId || !amount || !numberOfClasses || !transactionId) {
      return NextResponse.json(
        { success: false, message: "Missing required transaction details." },
        { status: 400 }
      );
    }

    const newTransaction = new Transaction({
      userId: new mongoose.Types.ObjectId(session.user.id),
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

export async function GET(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  // Allow admins to fetch transaction data
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: "Not Authenticated or Not an Admin" },
      { status: 401 }
    );
  }

  try {
    const courseId = request.nextUrl.searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ success: false, message: "Missing courseId parameter." }, { status: 400 });
    }

    const transactions = await Transaction.find({ courseId: courseId }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, message: "Transactions fetched successfully.", transactions: transactions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ success: false, message: "Error fetching transactions" }, { status: 500 });
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

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { transactionId: transactionId },
      { paymentStatus: status },
      { new: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json({ success: false, message: "Transaction not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Transaction updated successfully.", transaction: updatedTransaction });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ success: false, message: "Error updating transaction" }, { status: 500 });
  }
}