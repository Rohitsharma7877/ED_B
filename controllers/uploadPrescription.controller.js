const Prescription = require("../models/UploadPrescription.model");

// Create a new Prescription
exports.createPrescription = async (req, res) => {
  try {
    const { name, mobile } = req.body;
    const file = req.file ? req.file.filename : null; // Get the file path from multer

    const newPrescription = new Prescription({
      name,
      mobile,
      file,
    });

    await newPrescription.save();
    res.status(201).json({
      message: "Prescription uploaded successfully!",
      data: newPrescription,
    });
  } catch (err) {
    console.error("Error uploading Prescription:", err);
    res.status(500).json({ error: "Failed to upload Prescription", details: err.message });
  }
};

// Get all Prescriptions
exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.status(200).json({ data: prescriptions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Prescriptions", details: err.message });
  }
};

// Update Prescription Status
exports.updatePrescriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedPrescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    res.status(200).json({
      message: "Prescription status updated successfully!",
      data: updatedPrescription,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update Prescription status", details: err.message });
  }
};