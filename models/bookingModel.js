const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
  mobileNumber: { type: String, required: true, match: /^[0-9]{10}$/ },
  appointmentDate: { type: Date, required: true },
  pincode: { type: String, required: true, match: /^[0-9]{6}$/ },
});

module.exports = mongoose.model("Booking", bookingSchema);
