const mongoose = require("mongoose");

const HomeCollectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    pinCode: { type: String, required: true },
    state: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    gender: { type: String, required: true },
    bookFor: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeCollection", HomeCollectionSchema);
