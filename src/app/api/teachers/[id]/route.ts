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
    const teacher = await User.findOne({ _id: id, role: "teacher" }).lean();

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    // Map the database field (e.g., 'username') to the 'name' field expected by the frontend.
    // If your user model uses a different field for the name, like 'fullName', change 'teacher.username' accordingly.
    const teacherData = {
      ...teacher,
      name: teacher.fullName || 'N/A', // Fallback to 'username' if 'name' is missing, then 'N/A'
      id: teacher._id.toString(), // Ensure the ID is a string
    };

    return NextResponse.json(teacherData);
  } catch (error) {
    console.error('Failed to fetch teacher:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
