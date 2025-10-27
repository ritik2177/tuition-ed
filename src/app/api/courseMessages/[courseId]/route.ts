import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CourseMessage, { ICourseMessage } from "@/models/CourseMessage";
import User from "@/models/User";
import Course from "@/models/Course";

/**
 * GET /api/courseMessages/{courseId}
 * Fetches all messages for a specific course.
 * The user must be authenticated and part of the course (student, teacher, or admin).
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await context.params; // ✅ wait for params
  await dbConnect();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId)
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

  try {
    const course = await Course.findById(courseId);
    if (!course)
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });

    const isStudent = course.studentId?.toString() === userId;
    const isTeacher = course.teacherId?.toString() === userId;
    const isAdmin = session.user.role === "admin";

    if (!isStudent && !isTeacher && !isAdmin)
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });

    const messages = await CourseMessage.find({ courseId })
      .populate("senderId", "fullName role")
      .sort({ createdAt: 1 });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching course messages:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch messages" }, { status: 500 });
  }
}


/**
 * POST /api/courseMessages/{courseId}
 * Creates a new message in a course.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await context.params; // ✅ await here too
  await dbConnect();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId)
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

  try {
    const { message } = await request.json();
    if (!message)
      return NextResponse.json({ success: false, message: "Message cannot be empty" }, { status: 400 });

    const newMessage = await CourseMessage.create({
      courseId,
      senderId: userId,
      message,
    });

    const populatedMessage = await CourseMessage.findById(newMessage._id)
      .populate("senderId", "fullName role");

    return NextResponse.json({ success: true, message: populatedMessage }, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ success: false, message: "Failed to send message" }, { status: 500 });
  }
}

