const mongoose = require("mongoose");

const expertServiceListSchema = new mongoose.Schema({
  expertSerialTestNo: { type: String, required: true },
  testNo: { type: String, required: true },
  testName: { type: String, required: true },
  oldPrice: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  discountPercent: { type: Number, required: true },
  howManyTest: { type: Number, required: true },
  reportTime: { type: Number, required: true },
  consultation: { type: String, required: true }, // Added this line
  tagLine: { type: String, required: true },
  description: { type: String, required: true },
  selectedTests: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExpertServiceList", expertServiceListSchema);