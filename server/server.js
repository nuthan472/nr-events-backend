const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint
app.post("/api/contact", async (req, res) => {
  const { name, phone, people, couples, club } = req.body;

  if (!name || !phone || !people || !couples || !club) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // = nrevents1920@gmail.com
      pass: process.env.EMAIL_PASS,   // = Gmail App Password
    },
  });

  const mailOptions = {
    from: `"NR Events Clubbing" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // 👈 this is where the leads go
    // cc: "yourotheremail@gmail.com", // optional
    subject: "🎉 New Club Booking from Website",
    html: `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2>🍾 New Booking Alert!</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Total People:</strong> ${people}</p>
        <p><strong>Couples:</strong> ${couples}</p>
        <p><strong>Preferred Club:</strong> ${club}</p>
        <hr/>
        <p style="color: gray;">This lead came from the NR Events website ✨</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Lead sent to inbox:", process.env.EMAIL_USER);
    res.status(200).json({ message: "Booking email sent successfully." });
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    res.status(500).json({ error: "Failed to send booking email." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server live at http://localhost:${PORT}`);
});
