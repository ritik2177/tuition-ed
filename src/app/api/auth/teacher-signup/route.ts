import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendOtpEmail } from "@/lib/sendOtp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const {
      fullName,
      email,
      mobile,
      qualification,
      experience,
      listOfSubjects,
    } = await request.json();

    if (!fullName || !email) {
      return NextResponse.json({ message: "Full name and email are required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        fullName,
        email,
        mobile,
        qualification,
        experience,
        listOfSubjects,
        isVerified: false,
        role: "teacher",
      });
    } else {
      // If user exists, ensure their role is updated to teacher
      user.role = "teacher";
      user.fullName = fullName; // Also update their name
      user.qualification = qualification;
      user.experience = experience;
      user.listOfSubjects = listOfSubjects;
    }
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpEmail(email, otp);
    return NextResponse.json({ message: "OTP sent successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("Teacher Signup Error:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
