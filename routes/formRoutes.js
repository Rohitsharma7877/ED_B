const express = require("express");
const FormData = require("../models/formDataModel");

const router = express.Router();

// Save form data
router.post("/", async (req, res) => {
  try {
    const newFormData = new FormData(req.body);
    await newFormData.save();
    res.status(201).json(newFormData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving form data", error: error.message });
  }
});

// Fetch all form data
router.get("/", async (req, res) => {
  try {
    const formData = await FormData.find();
    res.status(200).json(formData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching form data", error: error.message });
  }
});

// Update process status
router.put("/update-process-status", async (req, res) => {
  const { id, status } = req.body;

  try {
    if (!["Pending", "Completed", "Under Process"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedFormData = await FormData.findByIdAndUpdate(
      id,
      { processCompleted: status },
      { new: true }
    );

    if (!updatedFormData) {
      return res.status(404).json({ message: "Form data not found" });
    }

    res.json(updatedFormData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
});

module.exports = router;
