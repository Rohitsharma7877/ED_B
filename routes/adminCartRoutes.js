const express = require("express");
const router = express.Router();
const AdminCart = require("../models/adminCart.model");
const Person = require("../models/person.models");
const verifyToken = require("../Middleware/authMiddleware");

// Save cart to admin view
router.post("/save", verifyToken, async (req, res) => {
  try {
     console.log("Received cart data:", req.body)
    const { cart } = req.body;
    const userId = req.user.id;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Cart is empty"
      });
    }

    const user = await Person.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Calculate total amount
    const totalAmount = cart.reduce((total, item) => {
      const testData = item.testId || item.subCategoryId;
      return total + (testData?.oldPrice || 0) * (item.quantity || 1);
    }, 0);

    const adminCartItem = new AdminCart({
      userId,
      userName: user.name,
      userEmail: user.email,
      userMobile: user.mobile,
      tests: cart.map(item => ({
        testId: item.testId?._id || item.subCategoryId?._id,
        testName: item.subCategoryId?.title || item.testId?.testName || "Unknown Test",
        price: item.subCategoryId?.oldPrice || item.testId?.oldPrice || 0,
        quantity: item.quantity || 1
      })),
      status: "pending",
      totalAmount
    });

    await adminCartItem.save();
    console.log("Saved cart:", adminCartItem); 
    res.status(201).json({ 
      success: true,
      message: "Test request submitted successfully! Admin will contact you soon."
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? err.message 
        : "Failed to process your request. Please try again."
    });
  }
});



// Get all carts for admin view
router.get("/", verifyToken, async (req, res) => {
  try {
    const carts = await AdminCart.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email mobile");
    res.json(carts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;