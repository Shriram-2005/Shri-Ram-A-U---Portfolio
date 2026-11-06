import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_EMAIL_TO || user;

    if (!user || !pass) {
      console.error("SMTP credentials missing from environment.");
      return NextResponse.json(
        { error: "Email delivery service temporarily unconfigured." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    const cleanSubject = subject ? subject.trim() : "New Portfolio Message";

    const mailOptions = {
      from: `"${name} (via Portfolio)" <${user}>`,
      replyTo: email,
      to,
      subject: `[Portfolio Inquiry] ${cleanSubject} - from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${cleanSubject}\n\nMessage:\n${message}\n\n---\nSent directly from shriramau.in contact form`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background: #ffffff;">
          <div style="border-bottom: 2px solid #8b5cf6; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #18181b; font-size: 20px;">New Message from Portfolio</h2>
            <p style="margin: 4px 0 0; color: #71717a; font-size: 13px;">Received via shriramau.in contact form</p>
          </div>
          
          <div style="margin-bottom: 16px;">
            <strong style="color: #52525b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Sender Details</strong>
            <table style="width: 100%; margin-top: 8px; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #71717a; width: 80px; font-size: 14px;">Name:</td>
                <td style="padding: 6px 0; color: #18181b; font-weight: 600; font-size: 14px;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-size: 14px;">Email:</td>
                <td style="padding: 6px 0; color: #8b5cf6; font-size: 14px;"><a href="mailto:${escapeHtml(email)}" style="color: #8b5cf6; text-decoration: none;">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-size: 14px;">Subject:</td>
                <td style="padding: 6px 0; color: #18181b; font-size: 14px;">${escapeHtml(cleanSubject)}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 20px; padding: 16px; background: #f4f4f5; border-radius: 8px;">
            <strong style="color: #52525b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">Message</strong>
            <div style="color: #27272a; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4e4e7; font-size: 12px; color: #a1a1aa; text-align: center;">
            Hit &quot;Reply&quot; in your email client to respond directly to ${escapeHtml(name)} (${escapeHtml(email)}).
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Your message has been delivered directly to Shri Ram's inbox." },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Contact API error:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to deliver email.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
