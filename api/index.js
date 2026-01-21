import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // -------------------- 1. CORS --------------------
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
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

  // -------------------- 4. Get data from body --------------------
  const { email, help } = req.body;

  if (!email || !help) {
    return res.status(400).json({ error: 'Missing email or help' });
  }

  // -------------------- 5. Nodemailer --------------------
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password
    }
  });

  try {
    // Email to company
    await transport.sendMail({
      to: process.env.Gmail,
      from: process.env.Gmail,
      subject: `A Request From InoByte`,
      text: `From: ${email}. Request: ${help}`
    });

    // Email to user
    await transport.sendMail({
      to: email,
      from: process.env.Gmail,
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
