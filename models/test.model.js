// models/test.model.js
const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  title: String,
  description: String,
  oldPrice: Number,
  image: String,
  homeCollection: Boolean,
  contrastPrice: Number,
});

module.exports = mongoose.model("Test", testSchema); // 👈 this name is important!
