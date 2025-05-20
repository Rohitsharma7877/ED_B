const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  age: Number,
  gender: String,
  email: String,
  clientName: String,
  doctorRef: String,
  pincode: String,
  date: String,
  address: String,
  state: String,
  time: String,
  bookFor: String,

  serviceName: { type: String, required: true },
});

module.exports = mongoose.model("Registration", registrationSchema);
