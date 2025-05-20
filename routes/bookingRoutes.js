const express = require("express");
const Booking = require("../models/bookingModel");

const router = express.Router();

// Save booking
router.post("/", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking saved successfully!", data: newBooking });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error saving booking", error: error.message });
  }
});

// Fetch all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: error.message });
  }
});

module.exports = router;
