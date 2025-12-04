import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import crypto from "crypto";
import { sendEmail } from "@/lib/sendEmail";

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
      classesToAdd, // Corrected from classesAdded to match the frontend payload
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

    // Safely update the number of classes
    const currentClasses = course.noOfClasses || 0;
    const classesToAddNumeric = Number(classesToAdd);

    // Ensure we are adding a valid number
    course.noOfClasses = currentClasses + (isNaN(classesToAddNumeric) ? 0 : classesToAddNumeric);
    await course.save();

    // 3. Send a success email
    if (session.user.email) {
      await sendEmail({
        to: session.user.email,
        subject: "Classes Added Successfully!",
        html: `
          <h1>Payment Successful!</h1>
          <p>Hi ${session.user.name || 'Student'},</p>
          <p>We're happy to let you know that <strong>${classesToAddNumeric}</strong> new classes have been successfully added to your course: <strong>${course.title}</strong>.</p>
          <p>Your new total class count is <strong>${course.noOfClasses}</strong>.</p>
          <p>Happy learning!</p>
        `,
      });
    }

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
