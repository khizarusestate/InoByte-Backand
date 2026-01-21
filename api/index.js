import nodemailer from 'nodemailer';
impo
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://ino-byte-nvit.vercel.app'); // frontend domain
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  let body;
  try {
    body = JSON.parse(req.body); // serverless req.body is string
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { email, help } = body;

  if (!email || !help) {
    return res.status(400).json({ error: 'Missing email or help' });
  }

  // Setup transporter
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS
    }
  });

  try {
    // Email to company
    await transport.sendMail({
      to: process.env.GMAIL_USER,
      from: process.env.GMAIL_USER,
      subject: `A Request From InoByte`,
      text: `From: ${email}. Request: ${help}`
    });

    // Email to user
    await transport.sendMail({
      to: email,
      from: process.env.GMAIL_USER,
      subject: `Hi ${email}! Your Request was Sent to InoByte`,
      text: `Please wait for our response. Thanks for your patience!`
    });

    console.log('Emails Sent');
    res.status(201).json({ message: 'Emails sent successfully!' });
  } catch (err) {
    console.error('Nodemailer Error:', err);
    res.status(500).json({ error: 'Error sending emails' });
  }
}


