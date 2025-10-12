import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Assuming you have a db connection utility
import DemoClass from '@/models/DemoClass';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    if (session.user.role !== 'student') {
      return NextResponse.json({ success: false, message: 'Only students can book a demo class.' }, { status: 403 });
    }

    const body = await request.json();
    const user = session.user;

    // Basic validation to ensure required fields are present
    const { parentName, grade, subject, city, country, demoTime } = body;
    if (!parentName || !grade || !subject || !city || !country || !demoTime) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }

    // If 'other' is the subject, ensure otherSubject is provided
    if (subject === 'other' && !body.otherSubject) {
        return NextResponse.json(
            { success: false, message: 'Please specify the subject.' },
            { status: 400 }
        );
    }

    const newDemoClass = await DemoClass.create({
      ...body,
      studentId: user.id,
      studentName: user.fullName,
      email: user.email,
      mobile: user.mobile,
    });

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Demo Class Confirmed! 🎉",
      html: `
        <h1>Hi ${body.studentName},</h1>
        <p>Your demo class has been successfully booked!</p>
        <p><b>Subject:</b> ${body.subject === 'other' ? body.otherSubject : body.subject}</p>
        <p><b>Time:</b> ${new Date(body.demoTime).toLocaleString()}</p>
        <p>We're excited to see you there!</p>
        <p>Best,</p>
        <p>The Tuition-ed Team</p>
      `,
    });

    // Send notification email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "ritikkatsa2005@gmail.com",
      subject: "New Demo Class Request! 🚀",
      html: `
        <h1>New Demo Class Request</h1>
        <p>A new demo class has been booked. Here are the details:</p>
        <ul>
          <li><strong>Student Name:</strong> ${user.fullName}</li>
          <li><strong>Parent's Name:</strong> ${body.parentName}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Mobile:</strong> ${user.mobile || 'Not provided'}</li>
          <li><strong>Grade:</strong> ${body.grade}</li>
          <li><strong>Subject:</strong> ${body.subject === 'other' ? body.otherSubject : body.subject}</li>
          <li><strong>Preferred Time:</strong> ${new Date(body.demoTime).toLocaleString()}</li>
          <li><strong>City:</strong> ${body.city}</li>
          <li><strong>Country:</strong> ${body.country}</li>
        </ul>
      `,
    });

    return NextResponse.json(
      { success: true, data: newDemoClass },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}