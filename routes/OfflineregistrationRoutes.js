const express = require("express");
const Registration = require("../models/OfflineRegistrationModel");

const router = express.Router();

// General Registration
router.post("/admin-general-registration", async (req, res) => {
  try {
    const newRegistration = new Registration({
      ...req.body,
      serviceName: "General Registration", // Add the selected service
    });
    await newRegistration.save();
    res.status(201).send("General Registration Saved Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Home Collection
router.post("/admin-home-collection", async (req, res) => {
  try {
    const newHomeCollection = new Registration({
      ...req.body,
      serviceName: "Home Collection", // Add the selected service
    });
    await newHomeCollection.save();
    res.status(201).send("Home Collection Saved Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Book Appointment
router.post("/admin-book-appointment", async (req, res) => {
  try {
    const newAppointment = new Registration({
      ...req.body,
      serviceName: "Book Appointment", // Add the selected service
    });
    await newAppointment.save();
    res.status(201).send("Appointment Saved Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/admin-registrations", async (req, res) => {
  try {
    const registrations = await Registration.find(); // Fetch all registrations
    res.status(200).json(registrations); // Return as JSON
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
