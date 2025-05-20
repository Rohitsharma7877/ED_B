// routes/subCategoryRoutes.js
const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategory.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer for file uploads
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only JPEG, PNG, and JPG files are allowed!"), false); // Reject the file
    }
  },
});


// CRUD Routes
// Route for creating a subcategory
router.post(
  "/subcategories",
  upload.single("image"),
  (req, res, next) => {
    if (req.fileValidationError) {
      console.error("File Validation Error:", req.fileValidationError.message);
      return res.status(400).json({ error: req.fileValidationError.message });
    }
    if (!req.file) {
      console.error("No file uploaded or invalid file type.");
      return res
        .status(400)
        .json({ error: "No file uploaded or invalid file type." });
    }
    next();
  },
  subCategoryController.createSubCategory
);

router.get("/subcategories", subCategoryController.getAllSubCategories);
router.get("/subcategories/:id", subCategoryController.getSubCategoryById);
router.put(
  "/subcategories/:id",
  upload.single("image"),
  subCategoryController.updateSubCategory
);
router.delete("/subcategories/:id", subCategoryController.deleteSubCategory);

module.exports = router;