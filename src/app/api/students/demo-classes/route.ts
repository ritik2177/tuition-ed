import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import DemoClass from '@/models/DemoClass';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  // Check if user is logged in and has the 'student' role
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const demoClasses = await DemoClass.find({ studentId: session.user.id })
      .sort({ date: 'asc' })
      .lean();

    return NextResponse.json(demoClasses);

  } catch (error) {
    console.error('Failed to fetch demo classes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
