import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { sendOtpEmail } from "@/lib/sendOtp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found. Please sign up first." }, { status: 404 });
    }

    // Generate OTP and expiry time
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: "OTP sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Login OTP Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}