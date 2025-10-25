import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { amount, courseId, classesToAdd, bookingId } = await request.json();

  // Check for essential environment variables
  if (!process.env.RP_KEY_ID || !process.env.RP_KEY_SECRET) {
    console.error("Razorpay Key ID or Key Secret is not defined in .env file");
    return NextResponse.json(
      { message: "Payment gateway is not configured. Please contact support." },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.RP_KEY_ID,
    key_secret: process.env.RP_KEY_SECRET,
  });

  // Dynamically build notes object to avoid undefined values
  const notes: { [key: string]: string | number } = {
    userId: session.user.id!,
  };
  if (courseId) notes.courseId = courseId;
  if (classesToAdd) notes.classesToAdd = classesToAdd;
  if (bookingId) notes.bookingId = bookingId;

  const options = {
    amount: Math.round(amount * 100), // Amount in the smallest currency unit (paise)
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: notes,
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { message: "Could not create payment order." },
      { status: 500 }
    );
  }
}