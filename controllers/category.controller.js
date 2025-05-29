const Category = require("../models/category.model");

// Create a new Category
exports.createCategory = async (req, res) => {
  try {
    const { testNo, title, description, category } = req.body;
    const image = req.file ? req.file.path : null; // Get the file path from multer

    const newCategory = new Category({
      testNo,
      image: req.file ? req.file.filename : null, // Save only the filename
      title,
      description,
      category,
    });

    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully!",
      data: newCategory,
    });
  } catch (err) {
    console.error("Error creating Category:", err);
    res
      .status(500)
      .json({ error: "Failed to create Category", details: err.message });
  }
};

// Get all Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ data: categories });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch Categories", details: err.message });
  }
};

// Get a single Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ data: category });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch Category", details: err.message });
  }
};

// Update a Category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { testNo, title, description, category } = req.body;

    // Find the existing category to keep the old image if no new image is uploaded
    const existingCategory = await Category.findById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    // If a new file is uploaded, use the new image; otherwise, keep the existing one
    const image = req.file ? req.file.filename : existingCategory.image;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        testNo,
        image, // Keep the existing image if no new one is uploaded
        title,
        description,
        category,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Category updated successfully!",
      data: updatedCategory,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update Category", details: err.message });
  }
};

// Delete a Category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete Category", details: err.message });
  }
};
