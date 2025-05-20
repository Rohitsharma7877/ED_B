// models/Contact.js
const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"] 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v); // Simple validation for 10-digit numbers
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [1000, "Message cannot exceed 1000 characters"]
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved"],
      default: "new"
    },
    responded: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Contact", ContactSchema);