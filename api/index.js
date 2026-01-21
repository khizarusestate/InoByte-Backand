import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    
    const { email, help } = req.body;
    const transport = nodemailer.createTransport({
    service: "gmail",
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

    console.log("Email Sent");
    res.status(201).json({ message: "Emails sent successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error sending emails" });
  }
}
