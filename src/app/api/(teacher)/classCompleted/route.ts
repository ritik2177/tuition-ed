import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Course from '@/models/Course';
import CompletedClass from '@/models/CompletedClass';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  await dbConnect();
  const dbSession = await mongoose.startSession();

  try {
    const session = await getServerSession(authOptions);
    const teacherId = session?.user?.id;

    if (!session || session.user.role !== 'teacher') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, topic, duration } = await request.json();

    if (!courseId || !topic) {
      return NextResponse.json({ message: 'Course ID and topic are required' }, { status: 400 });
    }

    let newCompletedClass;

    await dbSession.withTransaction(async () => {
      const course = await Course.findById(courseId).session(dbSession);

      if (!course) {
        throw new Error('Course not found.');
      }

      if (course.teacherId.toString() !== teacherId) {
        throw new Error('You are not authorized to modify this course.');
      }

      if (course.noOfClasses <= 0) {
        throw new Error('No remaining classes to complete.');
      }

      // Decrement the number of classes
      course.noOfClasses -= 1;

      // Increment the number of classes taught by the teacher
      course.noOfclassTeacher = (course.noOfclassTeacher || 0) + 1;

      // Create the new completed class record
      newCompletedClass = new CompletedClass({
        courseId: course._id,
        teacherId: course.teacherId,
        studentId: course.studentId,
        topic,
        duration: duration ? Number(duration) : undefined,
      });

      await newCompletedClass.save({ session: dbSession });
      await course.save({ session: dbSession });
    });

    return NextResponse.json({
      success: true,
      message: 'Class marked as complete and course updated.',
      data: newCompletedClass,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error marking class as complete:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  } finally {
    await dbSession.endSession();
  }
}