const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  jobCategory: {
    type: String,
    required: true,
  },
  resumeFile: {
    type: String,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Rejected", "Shortlisted"],
    default: "Pending",
  },
  notes: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Resume", resumeSchema);