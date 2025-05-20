const express = require("express");
const router = express.Router();
const ServiceBooking = require("../models/ServiceBooking");

// Create a new service booking
router.post("/", async (req, res) => {
  try {
    const {
      serviceType,
      name,
      email,
      mobile,
      age,
      gender,
      appointmentDate,
    } = req.body;

    // Validate required fields
    if (!serviceType || !name || !email || !mobile || !age || !gender || !appointmentDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBooking = new ServiceBooking({
      serviceType,
      name,
      email,
      mobile,
      age,
      gender,
      appointmentDate,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating service booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all service bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await ServiceBooking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching service bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;