const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  experienceLevel: {
    type: String,
    required: true,
  },
  reportsTo: {
    type: String,
    required: false,
  },
  overview: {
    type: String,
    required: true,
  },
  responsibilities: {
    type: [String],
    required: true,
  },
  qualifications: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Career", careerSchema);