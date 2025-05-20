const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  file: { type: String, required: true }, // Store the file path
  status: { type: String, enum: ["pending", "process", "approved"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prescription", prescriptionSchema);