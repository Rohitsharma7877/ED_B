const express = require("express");
const router = express.Router();
const Person = require("../models/person.models");
const { generateToken } = require("../Middleware/jwt");
const { sendOtp, generateOtp } = require("../utils/otpUtils");
const verifyToken = require("../Middleware/authMiddleware"); // Add this line
const Test = require("../models/test.model");
const mongoose = require("mongoose"); // Add this line at the top
const SubCategory = require("../models/subCategory.model");


// Helper function for error responses
const errorResponse = (res, status, message) => {
  return res.status(status).json({ success: false, error: message });
};

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

// routes/person.routes.js

router.post("/send-otp", async (req, res) => {
  try {
    const { mobile, name, email } = req.body;

    // Check if user exists
    let user = await Person.findOne({ mobile });

    if (!user) {
      // Create new user with a random password
      const tempPassword = Math.random().toString(36).slice(-8);
      user = new Person({
        name: name || "User",
        email: email || "",
        mobile,
        password: tempPassword,
        cart: [], // Initialize empty cart
      });
      await user.save();
    } else {
      // Update user details if provided
      if (name) user.name = name;
      if (email) user.email = email;
      await user.save();
    }

    // Generate and send OTP
    const otp = generateOtp();
    await sendOtp(mobile, otp);
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    res.status(200).json({
      message: "OTP sent successfully!",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to send OTP.",
      success: false,
    });
  }
});

// POST /person/verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp, name, email } = req.body;

    const user = await Person.findOne({ mobile });
    if (!user.otp || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({
        error: "OTP expired. Please request a new one.",
        success: false,
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        error: "Invalid OTP!",
        success: false,
      });
    }

    // Optional updates
    if (name) user.name = name;
    if (email) user.email = email;

    // Clear OTP
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // ✅ Correct token creation
    const token = generateToken({
      id: user._id,
      email: user.email,
      mobile: user.mobile,
    });

    // ✅ Correct response
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
      success: true,
    });
  } catch (err) {
    console.error("OTP verification error:", err.message);
    res.status(500).json({
      error: "OTP verification failed: " + err.message,
      success: false,
    });
  }
});

// In person.routes.js or cart.routes.js
router.post("/cart/add", verifyToken, async (req, res) => {
  try {
    // Validate input
    const { testId } = req.body;
    if (!testId) {
      return res.status(400).json({ 
        success: false,
        error: "Test ID is required" 
      });
    }

    // Verify test exists
    const test = await SubCategory.findById(testId);
    if (!test) {
      return res.status(404).json({ 
        success: false,
        error: "Test not found" 
      });
    }

    // Verify user exists
    const user = await Person.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    // Add to cart
    const existingItem = user.cart.find(item => 
      item.testId.toString() === testId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({
        testId: test._id,
        quantity: 1,
        addedAt: new Date()
      });
    }

    await user.save();

    return res.json({
      success: true,
      message: `${test.title} added to cart`,
      cart: user.cart
    });

  } catch (err) {
    console.error("Cart addition error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      detailedError: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        stack: err.stack
      } : undefined
    });
  }
});

// ✅ Fetch Cart Route (for Cart2.jsx)
router.get("/cart", verifyToken, async (req, res) => {
  // const user = await Person.findById(req.user.id).populate("cart.testId");
  try {
    const user = await Person.findById(req.user.id).populate("cart.testId");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validCart = user.cart.filter((item) => item.testId !== null);

    res.status(200).json({
      success: true,
      cart: validCart,
    });
  } catch (err) {
    console.error("🔥 Error fetching cart:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Remove from cart endpoint (optional but recommended)
router.post("/cart/remove", verifyToken, async (req, res) => {
  try {
    const { testId } = req.body;
    const user = await Person.findById(req.user.id);

    user.cart = user.cart.filter((item) => !item.testId.equals(testId));
    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: user.cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await Person.findById(req.user.id).select("-password -otp");
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
    success: true,
  });
});

console.log("✅ personRoutes.js loaded");
module.exports = router;
