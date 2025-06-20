const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");



const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config(); // Now this works because .env is in the same folder

console.log("Loaded EMAIL_USER:", process.env.EMAIL_USER);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS not defined in environment.");
  process.exit(1);
}


// Middleware
app.use(cors());
app.use(express.json());

// Contact form route
app.post("/api/contact", async (req, res) => {
  const { name, phone, people, couples, club } = req.body;

  // Basic validation
  if (!name || !phone || !people || !couples || !club) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Mail transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: `"NR Events Clubbing" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
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

  // Try sending email
  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", process.env.EMAIL_USER);
    res.status(200).json({ message: "Booking email sent successfully." });
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    res.status(500).json({ error: "Failed to send booking email." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server live at http://localhost:${PORT}`);
});
