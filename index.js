// index.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    
   "https://inoadesignstudio.com",
   "http://localhost:5173",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));



// Email Sending Route
app.post("/send-email", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  const date = new Date().toLocaleString();

  // 1. Create Transporter (Hostinger)
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // info@inoadesignstudio.com
      pass: process.env.EMAIL_PASS, // pass123
    },
  });

  // 2. HTML Template (UNCHANGED)
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Inquiry</title>
      <style>
        body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #171717;">
      
      <!-- Main Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <tr>
          <td style="background-color: #0a0a0a; padding: 40px 40px; text-align: center; border-bottom: 3px solid #fbbf24;">
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 2px; margin: 0; text-transform: uppercase;">Inoa Design Architecture Studio</h1>
            <p style="color: #fbbf24; font-size: 12px; text-transform: uppercase; letter-spacing: 3px; margin-top: 10px; margin-bottom: 0;">New Inquiry</p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 40px;">
            <h2 style="margin-top: 0; color: #171717; font-size: 20px; font-weight: 600;">${subject}</h2>
            <p style="color: #737373; font-size: 14px; margin-bottom: 30px;">Received on ${date}</p>

            <!-- Client Details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #737373; font-size: 13px; text-transform: uppercase;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #171717; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #737373; font-size: 13px; text-transform: uppercase;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #171717;">
                  <a href="mailto:${email}" style="color: #171717; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #737373; font-size: 13px; text-transform: uppercase;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; color: #171717;">${phone || "Not provided"}</td>
              </tr>
            </table>

            <!-- Message -->
            <p style="color: #737373; font-size: 13px; text-transform: uppercase;">Message Details</p>
            <div style="background-color: #f9fafb; padding: 25px; border-left: 4px solid #fbbf24; border-radius: 4px;">
              <p style="margin: 0; line-height: 1.6; color: #333; font-size: 16px;">${message.replace(/\n/g, "<br>")}</p>
            </div>

            <!-- Reply Button -->
            <div style="margin-top: 40px; text-align: center;">
              <a href="mailto:${email}" style="background-color: #0a0a0a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 2px; font-size: 14px; font-weight: 500;">Reply to Client</a>
            </div>

          </td>
        </tr>

      </table>
    </body>
    </html>
  `;

  // 3. Configure Email Options (UPDATED "from")
  const mailOptions = {
    from: `Inoa Design Studio <${process.env.EMAIL_USER}>`, // Hostinger requires domain email here
    to: process.env.EMAIL_USER,
    replyTo: email, // replying goes to client
    subject: subject,
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
