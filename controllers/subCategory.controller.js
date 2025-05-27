const SubCategory = require("../models/subCategory.model");

// Create a new SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    const {
      expertSerialTestNo,
      testNo,
      title,
      description,
      category,
      subCategory,
      oldPrice,
      discountedPrice,
      contrastPrice,
      homeCollection,
    } = req.body;
    const image = req.file ? req.file.path : null; // Get the file path from multer

    console.log("Request Body:", req.body); // Log the request body
    console.log("Uploaded File:", req.file); // Log the uploaded file

    const newSubCategory = new SubCategory({
      expertSerialTestNo, // New field
      testNo,
      image: req.file ? req.file.filename : null, // Save only the filename
      title,
      description,
      category,
      subCategory,
      oldPrice,
      discountedPrice,
      contrastPrice, // New field
      homeCollection,
    });

    await newSubCategory.save();
    res
      .status(201)
      .json({
        message: "SubCategory created successfully!",
        data: newSubCategory,
      });
  } catch (err) {
    console.error("Error creating SubCategory:", err); // Log the error
    res
      .status(500)
      .json({ error: "Failed to create SubCategory", details: err.message });
  }
};

// Get all SubCategories
exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find();
    res.status(200).json({ data: subCategories });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch SubCategories", details: err.message });
  }
};

// Get all test names for search
exports.getAllTestNames = async (req, res) => {
  try {
    const testNames = await SubCategory.find({}, 'title expertSerialTestNo testNo'); // Only return title and IDs
    res.status(200).json({ data: testNames });
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to fetch test names", 
      details: err.message 
    });
  }
};

// Get a single SubCategory by ID
exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }
    res.status(200).json({ data: subCategory });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch SubCategory", details: err.message });
  }
};

// Update a SubCategory by ID
exports.updateSubCategory = async (req, res) => {
  try {
    const {
      expertSerialTestNo,
      testNo,
      title,
      description,
      category,
      subCategory,
      oldPrice,
      discountedPrice,
      contrastPrice,
      homeCollection,
    } = req.body;

    // Find existing subcategory to retain old image if no new image is uploaded
    const existingSubCategory = await SubCategory.findById(req.params.id);
    if (!existingSubCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }

    // If a new file is uploaded, use the new image; otherwise, keep the existing one
    const image = req.file ? req.file.filename : existingSubCategory.image;

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      {
        expertSerialTestNo, // New field
        testNo,
        image, // Retain old image if no new file is uploaded
        title,
        description,
        category,
        subCategory,
        oldPrice,
        discountedPrice,
        contrastPrice, // New field
        homeCollection,
      },
      { new: true }
    );

    res
      .status(200)
      .json({
        message: "SubCategory updated successfully!",
        data: updatedSubCategory,
      });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update SubCategory", details: err.message });
  }
};

// Delete a SubCategory by ID
exports.deleteSubCategory = async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSubCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }
    res.status(200).json({ message: "SubCategory deleted successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete SubCategory", details: err.message });
  }
};
