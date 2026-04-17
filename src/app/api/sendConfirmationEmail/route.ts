import nodemailer from "nodemailer";

import {
  NODEMAILER_OPTIONS_FROM,
  NODEMAILER_OPTIONS_TO,
  NODEMAILER_TRANSPORTER_PASS,
  NODEMAILER_TRANSPORTER_SERVICE,
  NODEMAILER_TRANSPORTER_USER
} from "@/utils/constant";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    // Extract user information from the request body
    const { userEmail } = await req.json();

    if (!userEmail || typeof userEmail !== "string" || !EMAIL_REGEX.test(userEmail)) {
      return Response.json({ message: "Invalid email address" }, { status: 400 });
    }

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // Configure your email service here
      service: `${NODEMAILER_TRANSPORTER_SERVICE}`,
      auth: {
        user: `${NODEMAILER_TRANSPORTER_USER}`,
        pass: `${NODEMAILER_TRANSPORTER_PASS}`
      }
    });

    // Compose email message
    const mailOptions = {
      from: `${NODEMAILER_OPTIONS_FROM}`,
      to: `${NODEMAILER_OPTIONS_TO}`,
      subject: "Confirmação de e-mail do usuário",
      text: `Usuário com e-mail ${userEmail} confirmou seu endereço de e-mail.`
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return Response.json({ message: "Email sent to admin successfully" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Error sending email to admin" }, { status: 500 });
  }
}

export function OPTIONS() {
  return Response.json({ message: "Method Not Allowed" }, { status: 405 });
}
