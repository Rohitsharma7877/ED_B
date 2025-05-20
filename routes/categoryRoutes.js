const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer for file uploads
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
router.post(
  "/categories",
  upload.single("image"),
  categoryController.createCategory
);
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.put(
  "/categories/:id",
  upload.single("image"),
  categoryController.updateCategory
);
router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = router;
