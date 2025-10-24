import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; 
import DemoClass from '@/models/DemoClass';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import nodemailer from 'nodemailer';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    await dbConnect();

    let demoClasses;

    // If the user is an admin, fetch all demo classes. Otherwise, fetch only their own.
    if (session.user.role === 'admin') {
      demoClasses = await DemoClass.find({})
        .populate({ path: 'studentId', model: User, select: 'email fullName' })
        .sort({ date: -1 });
    } else {
      demoClasses = await DemoClass.find({ studentId: session.user.id }).sort({ date: -1 });
    }

    // The data is returned as a plain array, not nested in a `data` property.
    return NextResponse.json(demoClasses);
  } catch (error: any) {
    console.error('API GET Error:', error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();

    // Validation for fields coming from the form
    const { fatherName, email, grade, subject, topic, city, country, date } = body;
    if (!fatherName || !email || !grade || !subject || !topic || !city || !country || !date) {
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
      studentId: session.user.id,
      studentName: session.user.fullName,
      fatherName,
      grade,
      city,
      country,
      topic,
      subject: subject === 'other' ? body.otherSubject : subject,
      date,
      // teacherName can be assigned later by an admin
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
      to: email,
      subject: "Demo Class Confirmed! 🎉",
      html: `
        <h1>Hi ${session.user.fullName},</h1>
        <p>Your demo class has been successfully booked!</p>
        <p><b>Subject:</b> ${subject === 'other' ? body.otherSubject : subject}</p>
        <p><b>Time:</b> ${new Date(date).toLocaleString()}</p>
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
          <li><strong>Student Name:</strong> ${session.user.fullName}</li>
          <li><strong>Father's Name:</strong> ${fatherName}</li>
          <li><strong>Email:</strong> ${body.email}</li>
          <li><strong>Mobile:</strong> ${body.mobile || 'Not provided'}</li>
          <li><strong>Grade:</strong> ${grade}</li>
          <li><strong>Subject:</strong> ${subject === 'other' ? body.otherSubject : subject}</li>
          <li><strong>Topic:</strong> ${topic}</li>
          <li><strong>Preferred Time:</strong> ${new Date(date).toLocaleString()}</li>
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