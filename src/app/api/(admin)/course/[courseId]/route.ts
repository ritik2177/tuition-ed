import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Course from "@/models/Course";
import User from "@/models/User";
import mongoose from "mongoose";

/**
 * GET /api/admin/course/{courseId}
 * Fetches detailed information for a single course.
 * Accessible only by users with the 'admin' role.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> } // ✅ params is a Promise
) {
  const { courseId } = await context.params; // ✅ await params
  await dbConnect();

  try {
    // 1. Authenticate and Authorize the user as an admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    // 2. Find the course by its ID and populate related user data
    const course = await Course.findById(courseId)
      .populate({
        path: "teacherId",
        model: User,
        select: "fullName email mobile", // Fields to show for the teacher
      })
      .populate({
        path: "studentId",
        model: User,
        select: "fullName email mobile", // Fields to show for the student
      });

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Error fetching course details for admin:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching course details.",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/course/{courseId}
 * Updates detailed information for a single course.
 * Accessible only by users with the 'admin' role.
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> } // ✅ same fix here
) {
  const { courseId } = await context.params; // ✅ await params
  await dbConnect();

  try {
    // 1. Authenticate and Authorize the user as an admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    // 2. Validate Course ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Course ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      grade,
      classTime,
      classDays,
      noOfClasses,
      perClassPrice,
      joinLink,
      classroomLink,
      teacherId,
      paymentStatus,
    } = body;

    // 3. Basic validation for required fields
    if (
      !title ||
      !description ||
      !grade ||
      noOfClasses === undefined ||
      perClassPrice === undefined ||
      !teacherId
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 4. Validate teacherId
    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Teacher ID provided" },
        { status: 400 }
      );
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return NextResponse.json(
        {
          success: false,
          message: "Assigned teacher not found or is not a teacher",
        },
        { status: 400 }
      );
    }

    // 5. Update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title,
        description,
        grade,
        classTime,
        classDays,
        noOfClasses,
        perClassPrice,
        joinLink,
        classroomLink,
        teacherId: new mongoose.Types.ObjectId(teacherId),
        paymentStatus,
      },
      { new: true, runValidators: true }
    )
      .populate({
        path: "teacherId",
        model: User,
        select: "fullName email mobile",
      })
      .populate({
        path: "studentId",
        model: User,
        select: "fullName email mobile",
      });

    if (!updatedCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error: any) {
    console.error("Error updating course details for admin:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, message: error.message, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating course details.",
      },
      { status: 500 }
    );
  }
}
