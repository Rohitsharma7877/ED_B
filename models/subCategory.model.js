const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  expertSerialTestNo: { type: String, required: true }, // New field
  testNo: { type: String, required: true },
  image: { type: String }, // Store the image URL or file path
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  oldPrice: { type: String, required: true },
  discountedPrice: { type: String, required: true },
  contrastPrice: { type: String, required: true }, // New field
  homeCollection: { type: String, required: true },
  image: { type: String },
}, { timestamps: true });
//   createdAt: { type: Date, default: Date.now },
// });

module.exports = mongoose.model("SubCategory", subCategorySchema);