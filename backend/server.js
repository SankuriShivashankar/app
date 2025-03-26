require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Registration endpoint
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  console.log('User Registered:', name, email);

  // In a real app: save to database
  res.json({ message: `Thank you ${name}, registration successful!` });
});

// Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Google OAuth callback route with email confirmation
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('No code found');

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userInfoResponse.data;
    console.log('Google User:', user);

    // Send confirmation email to the user
    await transporter.sendMail({
      from: `"Medical Assist" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Registration Successful',
      text: `Hello ${user.name},\n\nThank you for registering using Google OAuth.\n\nHave a great day!`,
      html: `<p>Hello <strong>${user.name}</strong>,</p><p>Thank you for registering using Google OAuth.</p><p>Have a great day!</p>`,
    });

    res.send(`<h1>Hello, ${user.name} (${user.email})! Check your email for confirmation.</h1>`);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.send('Error during Google OAuth flow');
  }
});

// Endpoint to provide dynamic Google OAuth URL
app.get('/auth/google/url', (req, res) => {
  const url = `${process.env.GOOGLE_AUTH_BASE}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(process.env.GOOGLE_SCOPE)}&access_type=offline&prompt=consent`;
  res.json({ url });
});

// Start the server on PORT (from .env or default to 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
