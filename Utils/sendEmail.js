import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,        // e.g., "smtp.gmail.com"
      port: Number(process.env.SMTP_PORT),// e.g., 587
      secure: process.env.SMTP_PORT == 465, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,      // your Gmail
        pass: process.env.SMTP_PASS       // app password
      },
      tls: { rejectUnauthorized: false }
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"Boutique Auth" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text
    });

    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};
