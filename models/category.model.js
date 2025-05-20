const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  testNo: { type: String, required: true },
  image: { type: String }, // Store the image URL or file path
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Category", categorySchema);