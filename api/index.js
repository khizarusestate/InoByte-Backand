import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();

app.use(cors({
    methods: "POST",
    origin: "https://ino-byte.vercel.app",
    allowedHeaders: "Content-Type"
}));

app.use(express.json());

app.post('/help', async (req, res) => {
    const { email, help } = req.body;

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,    // Gmail address
            pass: process.env.GMAIL_APP_PASS // Gmail App Password
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
});

// Railway expects the app to listen on process.env.PORT
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
