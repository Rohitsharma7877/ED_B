const mongoose = require("mongoose");

const adminCartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String
  },
  userMobile: {
    type: String,
    required: true
  },
  tests: [{
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    testName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AdminCart", adminCartSchema);