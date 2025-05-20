const express = require("express");
const router = express.Router();
const HomeCollection = require("../models/HomeCollection");

// POST: Save a home collection appointment
router.post("/", async (req, res) => {
  const {
    name,
    email,
    mobile,
    address,
    pinCode,
    state,
    date,
    time,
    gender,
    bookFor,
  } = req.body;

  // Validate input
  if (
    !name ||
    !email ||
    !mobile ||
    !address ||
    !pinCode ||
    !state ||
    !date ||
    !time ||
    !gender ||
    !bookFor
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newCollection = new HomeCollection({
      name,
      email,
      mobile,
      address,
      pinCode,
      state,
      date,
      time,
      gender,
      bookFor,
    });

    await newCollection.save();
    return res
      .status(201)
      .json({ message: "Appointment booked successfully." });
  } catch (error) {
    console.error("Error saving appointment:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// GET: Retrieve all home collection appointments
router.get("/", async (req, res) => {
  try {
    const collections = await HomeCollection.find();
    return res.status(200).json(collections);
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
