import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  await dbConnect();

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "Course ID is required" },
      { status: 400 }
    );
  }

  try {
    const course = await Course.findById(id).populate({
      path: "teacherId",
      model: User,
      select: "fullName", // Correct field is 'fullName'
    });

    if (!course) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }

    // Security Check: Ensure the user is the enrolled student or an admin
    if (userRole !== 'admin' && course.studentId.toString() !== userId) {
      return NextResponse.json(
        { message: "Forbidden: You are not enrolled in this course." },
        { status: 403 }
      );
    }

    // Manually construct the response to include teacherName
    const courseData = {
      ...course.toObject(),
      teacherName: course.teacherId ? (course.teacherId as any).fullName : "Not Assigned",
    };

    return NextResponse.json(courseData, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}