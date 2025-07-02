const express = require("express");
const router = express.Router();
const Person = require("../models/person.models");
const { generateToken } = require("../Middleware/jwt");
const { sendOtp, validateOtp } = require("../utils/otpUtils");
const verifyToken = require("../Middleware/authMiddleware");
const SubCategory = require("../models/subCategory.model");
const mongoose = require("mongoose");

// Register New User
router.post("/signup", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const existingUser = await Person.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or mobile already exists!" });
    }
    const newUser = new Person({ name, email, mobile, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { mobile, name, email } = req.body;
    let user = await Person.findOne({ mobile });

    if (!user) {
      const tempPassword = Math.random().toString(36).slice(-8);
      user = new Person({
        name: name || "User",
        email: email || "",
        mobile,
        password: tempPassword,
        cart: []
      });
    } else {
      if (name) user.name = name;
      if (email) user.email = email;
    }

    const verificationId = await sendOtp(mobile);
    user.verificationId = verificationId;
    await user.save();

    res.status(200).json({ message: "OTP sent successfully!", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP.", success: false });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const user = await Person.findOne({ mobile });

    if (!user || !user.verificationId) {
      return res.status(400).json({ error: "Verification ID not found", success: false });
    }

    const isVerified = await validateOtp(user.verificationId, otp);
    if (!isVerified) {
      return res.status(400).json({ error: "Invalid or expired OTP", success: false });
    }

    user.verificationId = null;
    await user.save();

    const token = generateToken({ id: user._id, email: user.email, mobile: user.mobile });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile },
      success: true
    });
  } catch (err) {
    console.error("OTP verification error:", err.message);
    res.status(500).json({ error: "OTP verification failed", success: false });
  }
});

// Add to Cart
router.post("/cart/add", verifyToken, async (req, res) => {
  try {
    const { testId } = req.body;
    if (!testId) return res.status(400).json({ success: false, error: "Test ID is required" });

    const test = await SubCategory.findById(testId);
    if (!test) return res.status(404).json({ success: false, error: "Test not found" });

    const user = await Person.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const existingItem = user.cart.find(item => item.testId.toString() === testId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ testId: test._id, quantity: 1, addedAt: new Date() });
    }

    await user.save();
    res.json({
      success: true,
      message: `${test.title} added to cart`,
      cart: user.cart
    });
  } catch (err) {
    console.error("Cart addition error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Fetch Cart
router.get("/cart", verifyToken, async (req, res) => {
  try {
    const user = await Person.findById(req.user.id).populate({
      path: "cart.testId",
      model: "SubCategory",
      select: "title image oldPrice homeCollection contrastPrice"
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const validCart = user.cart.filter(item => item.testId != null);
    res.status(200).json({ success: true, cart: validCart });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Remove from Cart
router.post("/cart/remove", verifyToken, async (req, res) => {
  try {
    const { testId } = req.body;
    const user = await Person.findById(req.user.id);
    user.cart = user.cart.filter(item => !item.testId.equals(testId));
    await user.save();
    res.status(200).json({ success: true, message: "Item removed from cart", cart: user.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

// Get Profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await Person.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully", success: true });
});

console.log("✅ personRoutes.js loaded");
module.exports = router;