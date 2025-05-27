const mongoose = require("mongoose");

const AmbulanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  pickUpLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  date: { type: Date, required: true },
  conditionTest: { type: Boolean, default: false },
  // coordinates: {
  //   lat: { type: Number },
  //   lng: { type: Number }
  // },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ambulance", AmbulanceSchema);
