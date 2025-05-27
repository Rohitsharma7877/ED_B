const Resume = require("../models/resume.model");
const path = require("path");
const fs = require("fs");

// Submit a resume
exports.submitResume = async (req, res) => {
  try {
    const { name, email, phone, jobCategory } = req.body;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    const newResume = new Resume({
      name,
      email,
      phone,
      jobCategory,
      resumeFile: resumeFile.filename,
    });

    await newResume.save();
    res.status(201).json({
      message: "Resume submitted successfully!",
      data: newResume,
    });
  } catch (err) {
    console.error("Error submitting resume:", err);
    res.status(500).json({ error: "Failed to submit resume", details: err.message });
  }
};

// Get all resumes
exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ submissionDate: -1 });
    res.status(200).json({ data: resumes });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resumes", details: err.message });
  }
};

// Update resume status
exports.updateResumeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json({
      message: "Resume status updated successfully!",
      data: updatedResume,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update resume status", details: err.message });
  }
};

// Download resume file
exports.downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const filePath = path.join(__dirname, "../uploads/resumes", resume.resumeFile);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: "Failed to download resume", details: err.message });
  }
};

// Delete resume
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Delete the file from uploads
    const filePath = path.join(__dirname, "../uploads/resumes", resume.resumeFile);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Resume deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete resume", details: err.message });
  }
};