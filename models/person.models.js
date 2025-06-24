const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  mobile: { type: String, required: true, unique: true },
  password: { type: String },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  cart: [
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test", // 👈 model name must be exactly "Test"
      required: true,
    },
    quantity: { type: Number, default: 1 },
    addedAt: { type: Date, default: Date.now },
  },
],
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});



// Encrypt the password before saving
personSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
personSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Person", personSchema);