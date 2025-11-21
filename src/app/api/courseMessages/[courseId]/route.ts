import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import CourseMessage from '@/models/CourseMessage';
import User from '@/models/User';
import Course from '@/models/Course';

export async function GET(request: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await context.params; // ✅ await params
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }

    const isStudent = course.studentId.toString() === userId;
    const isTeacher = course.teacherId?.toString() === userId;

    if (!isStudent && !isTeacher) {
      return NextResponse.json({ success: false, message: 'You are not authorized to view these messages' }, { status: 403 });
    }

    const messages = await CourseMessage.find({ courseId }).populate({
      path: 'senderId',
      model: User,
      select: '_id fullName role',
    }).sort({ createdAt: 1 });

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await context.params; // ✅ await params
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const senderId = session?.user?.id;

    if (!senderId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { message, attachmentUrl, attachmentType } = await request.json();

    if (!message && !attachmentUrl) {
      return NextResponse.json({ success: false, message: 'Message content or attachment is required' }, { status: 400 });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }

    const isStudent = course.studentId.toString() === senderId;
    const isTeacher = course.teacherId?.toString() === senderId;

    if (!isStudent && !isTeacher) {
      return NextResponse.json({ success: false, message: 'You are not a member of this course' }, { status: 403 });
    }

    const newMessage = new CourseMessage({
      courseId,
      senderId,
      message: message || '',
      attachmentUrl,
      attachmentType,
    });

    await newMessage.save();

    const populatedMessage = await CourseMessage.findById(newMessage._id).populate({
      path: 'senderId',
      model: User,
      select: '_id fullName role',
    });

    return NextResponse.json({
      success: true,
      message: populatedMessage,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
