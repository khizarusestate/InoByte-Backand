import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Handle preflight requests for CORS
  res.setHeader("Access-Control-Allow-Origin", "https://ino-byte.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // CORS preflight
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, help } = req.body;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  try {
    // Email to your company
    await transport.sendMail({
      to: process.env.Gmail,
      from: process.env.Gmail,
      subject: "A Request From InoByte",
      text: `From: ${email}. Request: ${help}`,
    });

    // Confirmation email to user
    await transport.sendMail({
      to: email,
      from: process.env.CompanyGmail,
      subject: `Hi ${email}! Your Request was Sent to InoByte`,
      text: "Please wait for our response. Thanks for your patience!",
    });

    console.log("Email Sent");
    res.status(201).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email" });
  }
}
