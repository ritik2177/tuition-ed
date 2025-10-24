import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      classesAdded,
    } = await request.json();

    // 1. Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RP_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { message: "Invalid payment signature." },
        { status: 400 }
      );
    }

    // 2. Find and update the course
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    // Security check: ensure the user owns this course
    if (course.studentId.toString() !== session.user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    course.noOfClasses += Number(classesAdded);
    await course.save();

    return NextResponse.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Error updating course after payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

