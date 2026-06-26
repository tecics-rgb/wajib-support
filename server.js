// server.js — Wajib AI support contact form server
// Receives the support form submission and emails it to info@wajib.ai

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

const app = express();
app.set("trust proxy", 1); // needed on Render so rate limiting reads the real IP

// Parse JSON request bodies
app.use(express.json({ limit: "10kb" }));

// Allow requests from your website (with or without www)
app.use(
  cors({
    origin: true, // reflects the request origin — avoids www/non-www mismatch
    methods: ["POST"]
  })
);

// Limit each IP to 5 submissions per 10 minutes (anti-spam)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, error: "Too many requests. Please try again later." }
});

// Email transporter — uses your Google Workspace account via SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER, // info@wajib.ai
    pass: process.env.SMTP_APP_PASSWORD // Google App Password (16 chars)
  }
});

// Simple health check — open the Render URL in a browser to confirm it's alive
app.get("/", (req, res) => {
  res.send("Wajib support server is running.");
});

// The support form posts here
app.post("/api/support", limiter, async (req, res) => {
  try {
    const { name, email, category, message, website } = req.body || {};

    // Honeypot: real users never fill this hidden field; bots do.
    if (website) {
      return res.json({ success: true }); // silently ignore the bot
    }

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    await transporter.sendMail({
      from: '"Wajib Support" <info@wajib.ai>',
      to: "info@wajib.ai",
      replyTo: email, // hit Reply to answer the user directly
      subject: `Support — ${category || "General"}`,
      text:
        `New support message from wajib.ai\n\n` +
        `Name:  ${name}\n` +
        `Email: ${email}\n` +
        `Topic: ${category || "—"}\n\n` +
        `Message:\n${message}\n`
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ success: false, error: "Failed to send" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Support server listening on ${PORT}`));
