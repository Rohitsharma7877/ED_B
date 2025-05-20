const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// POST: Book an appointment
router.post("/", async (req, res) => {
  const { name, email, mobile, address, pinCode, state, gender, bookFor } =
    req.body;

  if (
    !name ||
    !email ||
    !mobile ||
    !address ||
    !pinCode ||
    !state ||
    !gender ||
    !bookFor
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newAppointment = new Appointment({
      name,
      email,
      mobile,
      address,
      pinCode,
      state,
      gender,
      bookFor,
    });

    await newAppointment.save();

    return res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET: Retrieve all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Error retrieving appointments:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
