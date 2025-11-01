import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import DemoClass from '@/models/DemoClass';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (status === 'confirmed') {
      // Find all demo classes with status 'confirmed'
      const confirmedDemos = await DemoClass.find({ status: 'confirmed' }).select('studentId').lean();
      
      // Extract unique student IDs
      const studentIds = [...new Set(confirmedDemos.map(demo => demo.studentId.toString()))];

      // Fetch only the users who are in the confirmed list
      const students = await User.find({
        _id: { $in: studentIds },
        role: 'student'
      }).select('fullName email mobile').lean();

      const formattedStudents = students.map(student => ({
        id: student._id.toString(),
        name: student.fullName,
        email: student.email,
        mobile: student.mobile || 'N/A',
      }));

      return NextResponse.json(formattedStudents);

    } else {
      // Default behavior: fetch all students if no specific status is requested
      const studentsFromDb = await User.find({ role: 'student' }).select('id fullName email mobile');

      const students = studentsFromDb.map(student => ({
        id: student.id,
        name: student.fullName,
        email: student.email,
        mobile: student.mobile || 'N/A',
      }));

      return NextResponse.json(students, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

  } catch (error) {
    console.error('[GET_STUDENTS_MONGO]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
