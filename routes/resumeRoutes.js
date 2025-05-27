const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resume.controller");
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/resumes"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only PDF, DOC, and DOCX files are allowed!"));
  },
});

// Submit a resume
router.post("/resumes", upload.single("resumeFile"), resumeController.submitResume);

// Get all resumes
router.get("/resumes", resumeController.getAllResumes);

// Update resume status
router.put("/resumes/:id", resumeController.updateResumeStatus);

// Download resume
router.get("/resumes/:id/download", resumeController.downloadResume);

// Delete resume
router.delete("/resumes/:id", resumeController.deleteResume);

module.exports = router;