import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.error("[Nodemailer Error]: Missing EMAIL_USER or EMAIL_PASS environment variables.");
      return NextResponse.json(
        {
          success: false,
          error: "Email service is not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${emailUser}>`,
      replyTo: `"${name}" <${email}>`,
      to: emailUser,
      subject: `Portfolio Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #171411;">
          <h2 style="color: #9A5A25;">New Portfolio Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f6e8d3; padding: 12px 16px; border-left: 4px solid #9A5A25; margin: 0;">
            ${message.replace(/\n/g, "<br/>")}
          </blockquote>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Nodemailer Send Mail Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to send email. Check your Gmail App Password.",
      },
      { status: 500 }
    );
  }
}