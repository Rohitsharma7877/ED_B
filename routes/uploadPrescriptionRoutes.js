const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/uploadPrescription.controller");
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
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only JPEG, PNG, JPG, and PDF files are allowed!"), false); // Reject the file
    }
  },
});

// CRUD Routes
router.post("/prescriptions", upload.single("file"), prescriptionController.createPrescription);
router.get("/prescriptions", prescriptionController.getAllPrescriptions);
router.put("/prescriptions/:id/status", prescriptionController.updatePrescriptionStatus);

module.exports = router;