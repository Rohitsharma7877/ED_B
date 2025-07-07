const express = require("express");
const router = express.Router();
const AdminCart = require("../models/adminCart.model");
const Person = require("../models/person.models");
const verifyToken = require("../Middleware/authMiddleware");

// Save cart to admin view
router.post("/save", verifyToken, async (req, res) => {
  try {
    const { cart } = req.body;
    const userId = req.user.id;

    // Get user details
    const user = await Person.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate total amount
    const totalAmount = cart.reduce((total, item) => {
      const testData = item.subCategoryId || item.testId;
      return total + (testData?.oldPrice || 0) * (item.quantity || 1);
    }, 0);

    // Create admin cart entry
    const adminCartItem = new AdminCart({
      userId,
      userName: user.name,
      userEmail: user.email,
      userMobile: user.mobile,
      tests: cart.map(item => ({
        testId: item.testId || item.subCategoryId._id,
        testName: item.subCategoryId?.title || item.testId?.title || "Unknown Test",
        price: item.subCategoryId?.oldPrice || item.testId?.oldPrice || 0,
        quantity: item.quantity || 1
      })),
      status: "pending",
      totalAmount
    });

    await adminCartItem.save();
    res.status(201).json({ success: true, message: "Cart saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all carts for admin view
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

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