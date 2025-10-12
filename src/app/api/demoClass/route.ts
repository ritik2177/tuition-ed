import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Assuming you have a db connection utility
import DemoClass from '@/models/DemoClass';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Basic validation to ensure required fields are present
    const { studentName, parentName, email, grade, subject, city, country, demoTime, studentId } = body;
    if (!studentName || !parentName || !email || !grade || !subject || !city || !country || !demoTime) {
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
          <li><strong>Student Name:</strong> ${body.studentName}</li>
          <li><strong>Parent's Name:</strong> ${body.parentName}</li>
          <li><strong>Email:</strong> ${body.email}</li>
          <li><strong>Mobile:</strong> ${body.mobile || 'Not provided'}</li>
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