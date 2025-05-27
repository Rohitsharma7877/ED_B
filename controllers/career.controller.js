const Career = require("../models/career.model");

// Create a new Career
exports.createCareer = async (req, res) => {
  try {
    const { category, jobTitle, experienceLevel, reportsTo, overview, responsibilities, qualifications } = req.body;

    // Convert responsibilities and qualifications strings to arrays
    const responsibilitiesArray = responsibilities.split('\n').filter(item => item.trim() !== '');
    const qualificationsArray = qualifications.split('\n').filter(item => item.trim() !== '');

    const newCareer = new Career({
      category,
      jobTitle,
      experienceLevel,
      reportsTo,
      overview,
      responsibilities: responsibilitiesArray,
      qualifications: qualificationsArray
    });

    await newCareer.save();
    res.status(201).json({
      message: "Career created successfully!",
      data: newCareer,
    });
  } catch (err) {
    console.error("Error creating Career:", err);
    res
      .status(500)
      .json({ error: "Failed to create Career", details: err.message });
  }
};

// Get all Careers
exports.getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find();
    res.status(200).json({ data: careers });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch Careers", details: err.message });
  }
};

// Get a single Career by ID
exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ error: "Career not found" });
    }
    res.status(200).json({ data: career });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch Career", details: err.message });
  }
};

// Update a Career by ID
exports.updateCareer = async (req, res) => {
  try {
    const { category, jobTitle, experienceLevel, reportsTo, overview, responsibilities, qualifications } = req.body;

    // Convert responsibilities and qualifications strings to arrays
    const responsibilitiesArray = responsibilities.split('\n').filter(item => item.trim() !== '');
    const qualificationsArray = qualifications.split('\n').filter(item => item.trim() !== '');

    const updatedCareer = await Career.findByIdAndUpdate(
      req.params.id,
      {
        category,
        jobTitle,
        experienceLevel,
        reportsTo,
        overview,
        responsibilities: responsibilitiesArray,
        qualifications: qualificationsArray
      },
      { new: true }
    );

    res.status(200).json({
      message: "Career updated successfully!",
      data: updatedCareer,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update Career", details: err.message });
  }
};

// Delete a Career by ID
exports.deleteCareer = async (req, res) => {
  try {
    const deletedCareer = await Career.findByIdAndDelete(req.params.id);
    if (!deletedCareer) {
      return res.status(404).json({ error: "Career not found" });
    }
    res.status(200).json({ message: "Career deleted successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete Career", details: err.message });
  }
};