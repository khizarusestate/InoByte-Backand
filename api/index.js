// File: /api/index.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // -------------------- 1. CORS --------------------
  res.setHeader('Access-Control-Allow-Origin', 'https://ino-byte.vercel.app'); // frontend domain
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // -------------------- 2. Preflight --------------------
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // -------------------- 3. Only POST allowed --------------------
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // -------------------- 4. Use req.body directly --------------------
  const { email, help } = req.body;

  if (!email || !help) {
    return res.status(400).json({ error: 'Missing email or help' });
  }

  // -------------------- 5. Nodemailer --------------------
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'services.inobyte@gmail.com',     // Hardcoded for testing
      pass: 'vhqf bujd cwrb shjm'             // Hardcoded App Password (spaces included if Gmail generated)
    }
  });

  try {
    // Email to company
    await transport.sendMail({
      to: 'services.inobyte@gmail.com',
      from: 'services.inobyte@gmail.com',
      subject: `A Request From InoByte`,
      text: `From: ${email}. Request: ${help}`
    });

    // Email to user
    await transport.sendMail({
      to: email,
      from: 'services.inobyte@gmail.com',
      subject: `Hi ${email}! Your Request was Sent to InoByte`,
      text: `Please wait for our response. Thanks!`
    });

    console.log('Emails Sent');
    res.status(201).json({ message: 'Emails sent successfully!' });
  } catch (err) {
    console.error('Nodemailer Error:', err);
    res.status(500).json({ error: 'Error sending emails' });
  }
}
