const express = require("express");
const router = express.Router();
const Ambulance = require("../models/ambulanceModel");

// POST: Book an ambulance service
router.post("/", async (req, res) => {
  const {
    name,
    mobile,
    age,
    gender,
    email,
    pickUpLocation,
    dropLocation,
    date,
    conditionTest,
  } = req.body;

  // Validation
  if (
    !name ||
    !mobile ||
    !age ||
    !gender ||
    !email ||
    !pickUpLocation ||
    !dropLocation ||
    !date
  ) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  try {
    const newAmbulanceRequest = new Ambulance({
      name,
      mobile,
      age,
      gender,
      email,
      pickUpLocation,
      dropLocation,
      date: new Date(date),
      conditionTest: conditionTest || false,
    });

    await newAmbulanceRequest.save();
    return res.status(201).json({ message: "Ambulance service booked successfully" });
  } catch (error) {
    console.error("Error booking ambulance service:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET: Get all ambulance bookings
router.get("/", async (req, res) => {
  try {
    const ambulanceRequests = await Ambulance.find().sort({ createdAt: -1 });
    return res.status(200).json(ambulanceRequests);
  } catch (error) {
    console.error("Error fetching ambulance requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
