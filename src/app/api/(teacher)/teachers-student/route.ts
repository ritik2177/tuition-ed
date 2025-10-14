import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Course from '@/models/Course';
import User from '@/models/User';

/**
 * GET handler to fetch students for a logged-in teacher.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const teacherId = session?.user?.id;

    // Secure the endpoint: only allow logged-in teachers
    if (!session || session.user.role !== 'teacher') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Step 1: Find all courses taught by the logged-in teacher.
    const teacherCourses = await Course.find({ teacherId }).lean();

    if (teacherCourses.length === 0) {
      // It's valid for a teacher to have no courses or students, so return an empty array.
      return NextResponse.json([]);
    }

    // Step 2: Extract all unique student IDs from those courses.
    // Your `Course` model has one `studentId` per course document.
    // We use a Set to ensure we only have unique student IDs.
    const studentIds = new Set(
      teacherCourses.map(course => course.studentId.toString())
    );

    // Step 3: Find the full student objects that match the extracted IDs.
    const accessibleStudents = await User.find({
      _id: { $in: Array.from(studentIds) }
    }).select('_id fullName email mobile'); // Select only the fields you need

    // Map to a more client-friendly format if desired
    const studentData = accessibleStudents.map(student => ({
      id: student._id.toString(),
      name: student.fullName,
      email: student.email,
      mobile: student.mobile || 'N/A'
    }));

    // Step 4: Return the list of students.
    return NextResponse.json(studentData);

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}