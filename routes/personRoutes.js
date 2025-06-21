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
        name: name || 'User',
        email: email || '',
        mobile, 
        password: tempPassword,
        cart: [] // Initialize empty cart
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
        id: user._id, // Include MongoDB _id
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

// In person.routes.js or cart.routes.js

// Add to cart endpoint
router.post("/cart/add", verifyToken, async (req, res) => {
  try {
    const { testId } = req.body;
    const user = await Person.findById(req.user.id);
    
    // Check if item already in cart
    const existingItem = user.cart.find(item => item.testId.equals(testId));
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ testId });
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: user.cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});



// Remove from cart endpoint (optional but recommended)
router.post("/cart/remove", verifyToken, async (req, res) => {
  try {
    const { testId } = req.body;
    const user = await Person.findById(req.user.id);
    
    user.cart = user.cart.filter(item => !item.testId.equals(testId));
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: user.cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

// Add protected routes
// Get cart items endpoint
router.get("/cart", verifyToken, async (req, res) => {
  try {
    const user = await Person.findById(req.user.id).populate('cart.testId');
    res.status(200).json({
      success: true,
      cart: user.cart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

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
