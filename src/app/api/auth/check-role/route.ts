import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('role');

    if (!user) {
      return NextResponse.json({ role: null }, { status: 200 });
    }

    return NextResponse.json({ role: user.role }, { status: 200 });
  } catch (error) {
    console.error("CHECK_ROLE_ERROR:", error); // Add detailed logging
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
