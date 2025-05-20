const express = require("express");
const router = express.Router();
const Person = require("../models/person.models");
const { generateToken } = require("../Middleware/jwt");
const { sendOtp, generateOtp } = require("../utils/otpUtils");
const verifyToken = require("../Middleware/authMiddleware"); // Add this line



router.post("/signup", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if email or mobile is already registered
    const existingUser = await Person.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or mobile already exists!" });
    }

    // Save user data
    const newUser = new Person({ name, email, mobile, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;

    // Check if the mobile number exists
    const user = await Person.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ error: "Mobile number not registered!" });
    }

    // Generate and send OTP
    const otp = generateOtp();
    await sendOtp(mobile, otp); // Send OTP via Twilio
    user.otp = otp; // Save OTP in the database
    await user.save();

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP." });
  }
});

// routes/person.routes.js

// Update the send-otp route
router.post("/send-otp", async (req, res) => {
  try {
    const { mobile, name, email } = req.body;

    // Check if user exists
    let user = await Person.findOne({ mobile });

    if (!user) {
      // Create new user if doesn't exist
      const tempPassword = Math.random().toString(36).slice(-8);
      user = new Person({ 
        name, 
        email, 
        mobile, 
        password: tempPassword 
      });
      await user.save();
    } else {
      // Update name and email if provided
      if (name) user.name = name;
      if (email) user.email = email;
      await user.save();
    }

    // Generate and send OTP
    const otp = generateOtp();
    await sendOtp(mobile, otp);
    user.otp = otp;
    await user.save();

    res.status(200).json({ 
      message: "OTP sent successfully!",
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to send OTP.",
      success: false
    });
  }
});

// Update the verify-otp route
// In your backend routes (person.routes.js)
router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp, name, email } = req.body;

    const user = await Person.findOne({ mobile });
    if (!user || user.otp !== otp) {
      return res.status(400).json({
        error: "Invalid OTP!",
        success: false,
      });
    }

    // Update user details if provided
    if (name) user.name = name;
    if (email) user.email = email;
    user.otp = null;
    await user.save();

    const token = generateToken({ 
      id: user._id, 
      email: user.email,
      mobile: user.mobile
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        name: user.name,
        email: user.email,
        mobile: user.mobile
      },
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "OTP verification failed.",
      success: false,
    });
  }
});

// Add protected routes
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await Person.findById(req.user.id).select('-password -otp');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  // In a real implementation, you might want to add the token to a blacklist
  res.status(200).json({ 
    message: "Logged out successfully",
    success: true 
  });
});

module.exports = router;
