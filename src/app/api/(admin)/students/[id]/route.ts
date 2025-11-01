import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import DemoClass, { IDemoClass } from '@/models/DemoClass';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ Await here

  try {
    await dbConnect();

    const student = await User.findById(id).select('-otp -otpExpires -password').lean();
    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    const demoClass = await DemoClass.findOne({ studentId: id })
      .sort({ createdAt: -1 })
      .lean() as IDemoClass | null;

    const studentDetails = {
      _id: student._id.toString(),
      name: student.fullName,
      email: student.email,
      mobile: student.mobile || 'N/A',
      dateOfBirth: student.dateOfBirth || null,
      address: student.address || { street: '', city: '', state: '', country: '' },
      grade: demoClass?.grade || 'N/A',
      fatherName: demoClass?.fatherName || 'N/A',
      country: demoClass?.country || student.address?.country || 'N/A',
    };

    return NextResponse.json(studentDetails);
  } catch (error) {
    console.error('[GET_STUDENT_DETAILS]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
