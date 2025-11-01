import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";
import CompletedClass from "@/models/CompletedClass";
import User from "@/models/User";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; courseId: string }> } // 👈 mark params as a Promise
) {
  try {
    await dbConnect();

    const { id: teacherId, courseId } = await context.params; // ✅ await params

    // Fetch the course details based on courseId and teacherId
    const course = await Course.findOne({
      _id: courseId,
      teacherId: teacherId,
    }).populate({
      path: "studentId",
      model: User,
      select: "fullName email",
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    const completedClasses = await CompletedClass.find({ courseId: course._id });

    return NextResponse.json({
      success: true,
      course,
      completedClasses,
    });
  } catch (error) {
    console.error("[GET_TEACHER_COURSE_DETAILS]", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
