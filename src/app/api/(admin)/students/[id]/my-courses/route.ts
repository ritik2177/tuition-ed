import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Course from '@/models/Course';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: studentId } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return NextResponse.json({ message: 'Invalid student ID' }, { status: 400 });
  }

  try {
    await dbConnect();
    const courses = await Course.find({ studentId }).sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: studentId } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return NextResponse.json({ message: 'Invalid student ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      grade,
      noOfClasses,
      perClassPrice,
      classTime,
      teacherId,
      classDays,
      joinLink,
    } = body;

    if (!title || !description || !grade || !noOfClasses || !perClassPrice || !teacherId) {
      return NextResponse.json(
        { message: 'Missing required course fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
    }

    const newCourse = new Course({
      title,
      description,
      grade,
      noOfClasses,
      perClassPrice,
      classTime,
      classDays,
      joinLink,
      studentId: student._id,
      teacherId: teacher._id,
    });

    await newCourse.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Course created and assigned successfully',
        course: newCourse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to assign course:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: 'Validation Error', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
