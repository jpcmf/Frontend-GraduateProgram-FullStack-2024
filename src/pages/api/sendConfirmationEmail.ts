import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";

import {
  NODEMAILER_REQUEST_SERVER,
  NODEMAILER_TRANSPORTER_SERVICE,
  NODEMAILER_TRANSPORTER_USER,
  NODEMAILER_TRANSPORTER_PASS,
  NODEMAILER_OPTIONS_FROM,
  NODEMAILER_OPTIONS_TO
} from "@/utils/constant";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Check if request is coming from the server
    if (!req.headers || !req.headers.host || !req.headers.host.startsWith(`${NODEMAILER_REQUEST_SERVER}`)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    // Extract user information from the request body
    const { userEmail } = req.body;

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
