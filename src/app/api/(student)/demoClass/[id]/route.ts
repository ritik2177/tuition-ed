import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DemoClass from '@/models/DemoClass';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new NextResponse('Invalid Demo Class ID', { status: 400 });
    }

    const demoClass = await DemoClass.findById(id)
      .populate({
        path: 'studentId',
        model: User,
        select: '_id fullName email mobile', // Select all necessary student fields
      })
      .lean();

    if (!demoClass) {
      return new NextResponse('Demo Class not found', { status: 404 });
    }

    return NextResponse.json(demoClass);
  } catch (error) {
    console.error('[GET_DEMOCLASS_BY_ID]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
