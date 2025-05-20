const mongoose = require("mongoose");

const formDataSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  age: Number,
  gender: String,
  email: String,
  pincode: String,
  service: String,
  bookingDate: { type: Date, required: true },
  pickUpLocation: { type: String },
  dropLocation: { type: String },
  additionalFields: Array,
  processCompleted: {
    type: String,
    enum: ["Pending", "Completed", "Under Process"],
    default: "Pending",
  },
});

module.exports = mongoose.model("FormData", formDataSchema);
