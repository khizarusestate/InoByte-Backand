import express from "express";
import cors from "cors";
import sgMail from "@sendgrid/mail";

const app = express();

// Set SendGrid API Key from environment
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors({
  origin: "https://ino-byte.vercel.app",
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Optional: GET route for browser friendly test
app.get('/help', (req,res)=>{
  res.send("POST /help endpoint is live. Use a POST request to send data.");
});

// POST /help route
app.post("/help", async (req, res) => {
  const { email, help } = req.body;

  const msgToCompany = {
    to: process.env.CompanyGmail,
    from: process.env.CompanyGmail,
    subject: "A Request From InoByte",
    text: `From: ${email}. Request: ${help}`,
  };

  const msgToUser = {
    to: email,
    from: process.env.CompanyGmail,
    subject: `Hi ${email}! Your Request was Sent to InoByte`,
    text: "Please wait for our response. Thanks for your patience!",
  };

  try {
    await sgMail.send(msgToCompany);
    await sgMail.send(msgToUser);

    console.log("Emails sent via SendGrid!");
    res.status(201).json({ message: "Request sent successfully!" });
  } catch (err) {
    console.log("SendGrid Error:", err);
    res.status(500).json({ error: "Server Error. Check logs." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
