const express = require("express");
const router = express.Router();
const careerController = require("../controllers/career.controller");

// Create a new Career
router.post("/careers", careerController.createCareer);

// Get all Careers
router.get("/careers", careerController.getAllCareers);

// Get a single Career by ID
router.get("/careers/:id", careerController.getCareerById);

// Update a Career by ID
router.put("/careers/:id", careerController.updateCareer);

// Delete a Career by ID
router.delete("/careers/:id", careerController.deleteCareer);

module.exports = router;