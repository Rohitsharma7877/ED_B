const mongoose = require("mongoose");

const ServiceBookingSchema = new mongoose.Schema(
  {
    serviceType: { type: String, required: true },
    testName: { type: String, required: true }, // Added testName field
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceBooking", ServiceBookingSchema);