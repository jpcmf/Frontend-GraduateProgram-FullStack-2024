import { NextApiRequest, NextApiResponse } from "next";

import nodemailer from "nodemailer";

import {
  NODEMAILER_OPTIONS_FROM,
  NODEMAILER_OPTIONS_TO,
  NODEMAILER_TRANSPORTER_PASS,
  NODEMAILER_TRANSPORTER_SERVICE,
  NODEMAILER_TRANSPORTER_USER
} from "@/utils/constant";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Extract user information from the request body
    const { userEmail } = req.body;

    if (!userEmail || typeof userEmail !== "string" || !EMAIL_REGEX.test(userEmail)) {
      res.status(400).json({ message: "Invalid email address" });
      return;
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

    try {
      // Send email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent to admin successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Error sending email to admin" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
