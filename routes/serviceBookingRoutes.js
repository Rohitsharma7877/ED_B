const express = require("express");
const router = express.Router();
const ServiceBooking = require("../models/ServiceBooking");

// Create a new service booking
router.post("/", async (req, res) => {
  try {
    const {
      serviceType,
      testName,
      name,
      email,
      mobile,
      age,
      gender,
      appointmentDate
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "serviceType", "testName", "name", "email", 
      "mobile", "age", "gender", "appointmentDate"
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields
      });
    }

    const newBooking = new ServiceBooking({
      serviceType,
      testName,
      name,
      email,
      mobile,
      age,
      gender,
      appointmentDate
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating service booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all service bookings with sorting and filtering
router.get("/", async (req, res) => {
  try {
    const { serviceType, status, fromDate, toDate } = req.query;
    let query = {};

    // Add filters if provided
    if (serviceType) query.serviceType = serviceType;
    if (status) query.status = status;
    if (fromDate || toDate) {
      query.appointmentDate = {};
      if (fromDate) query.appointmentDate.$gte = new Date(fromDate);
      if (toDate) query.appointmentDate.$lte = new Date(toDate);
    }

    const bookings = await ServiceBooking.find(query)
      .sort({ appointmentDate: 1, createdAt: -1 });
      
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching service bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update booking status
// Update booking status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status input
    const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Valid status is required",
        validStatuses
      });
    }

    const booking = await ServiceBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json({
      success: true,
      message: "Status updated successfully",
      booking
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update status",
      error: error.message 
    });
  }
});


module.exports = router;