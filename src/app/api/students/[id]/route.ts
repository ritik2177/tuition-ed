import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await dbConnect();

    // Use .lean() for better performance as it returns a plain JavaScript object
    const student = await User.findOne({ _id: id, role: "student" }).lean();

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Map the database field (e.g., 'username') to the 'name' field expected by the frontend.
    // If your user model uses a different field for the name, like 'fullName', change 'student.username' accordingly.
    const studentData = {
      ...student,
      name: student.fullName || 'N/A', // Fallback to 'username' if 'name' is missing, then 'N/A'
      id: student._id.toString(), // Ensure the ID is a string
    };

    return NextResponse.json(studentData);
  } catch (error) {
    console.error('Failed to fetch student:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
