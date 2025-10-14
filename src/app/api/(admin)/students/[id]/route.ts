import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Course from '@/models/Course';
import mongoose from 'mongoose';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: studentId } = await context.params; // await params
  const session = await getServerSession(authOptions);

  //  Fix this condition: previous one always returned Unauthorized
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return NextResponse.json({ message: 'Invalid student ID' }, { status: 400 });
  }

  try {
    await dbConnect();

    const student = await User.findById(studentId)
      .lean();

    if (!student) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const responseData = {
      _id: student._id,
      name: student.fullName,
      email: student.email,
      mobile: student.mobile,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch student details:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
