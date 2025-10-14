import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();

    // Fetch all documents from the User collection where the role is 'student'
    const studentsFromDb = await User.find({ role: 'student' }).select('id fullName email mobile');

    // Map the data to match the frontend's expected 'Student' type
    const students = studentsFromDb.map(student => ({
      id: student.id,
      name: student.fullName,
      email: student.email,
      mobile: student.mobile || 'N/A', // Provide a fallback for optional fields
    }));

    return NextResponse.json(students, {
      headers: { 'Cache-Control': 'no-store' }, // Ensure fresh data on every request
    });
  } catch (error) {
    console.error('[GET_STUDENTS_MONGO]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
