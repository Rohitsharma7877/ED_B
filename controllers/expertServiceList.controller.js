const ExpertServiceList = require("../models/expertServiceList.model");

// Create a new ExpertServiceList
exports.createExpertServiceList = async (req, res) => {
  try {
    const {
      expertSerialTestNo,
      testNo,
      testName,
      oldPrice,
      discountPrice,
      discountPercent,
      howManyTest,
      reportTime,
      consultation, // Added this
      tagLine,
      description,
      selectedTests,
    } = req.body;

    const newExpertServiceList = new ExpertServiceList({
      expertSerialTestNo,
      testNo,
      testName,
      oldPrice,
      discountPrice,
      discountPercent,
      howManyTest,
      reportTime,
      consultation, // Added this
      tagLine,
      description,
      selectedTests,
    });

    await newExpertServiceList.save();
    res.status(201).json({
      message: "ExpertServiceList created successfully!",
      data: newExpertServiceList,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to create ExpertServiceList",
      details: err.message,
    });
  }
};

// Get all ExpertServiceLists
exports.getAllExpertServiceLists = async (req, res) => {
  try {
    const expertServiceLists = await ExpertServiceList.find();
    res.status(200).json({ data: expertServiceLists });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch ExpertServiceLists",
      details: err.message,
    });
  }
};

// Get a single ExpertServiceList by ID
exports.getExpertServiceListById = async (req, res) => {
  try {
    const expertServiceList = await ExpertServiceList.findById(req.params.id);
    if (!expertServiceList) {
      return res.status(404).json({ error: "ExpertServiceList not found" });
    }
    res.status(200).json({ data: expertServiceList });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch ExpertServiceList",
      details: err.message,
    });
  }
};

// Update a ExpertServiceList by ID
exports.updateExpertServiceList = async (req, res) => {
  try {
    const {
      expertSerialTestNo,
      testNo,
      testName,
      oldPrice,
      discountPrice,
      discountPercent,
      howManyTest,
      reportTime,
      consultation, // Added this
      tagLine,
      description,
      selectedTests,
    } = req.body;

    const updatedExpertServiceList = await ExpertServiceList.findByIdAndUpdate(
      req.params.id,
      {
        expertSerialTestNo,
        testNo,
        testName,
        oldPrice,
        discountPrice,
        discountPercent,
        howManyTest,
        reportTime,
        consultation, // Added this
        tagLine,
        description,
        selectedTests,
      },
      { new: true }
    );

    res.status(200).json({
      message: "ExpertServiceList updated successfully!",
      data: updatedExpertServiceList,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to update ExpertServiceList",
      details: err.message,
    });
  }
};

// Delete a ExpertServiceList by ID
exports.deleteExpertServiceList = async (req, res) => {
  try {
    const deletedExpertServiceList = await ExpertServiceList.findByIdAndDelete(
      req.params.id
    );
    if (!deletedExpertServiceList) {
      return res.status(404).json({ error: "ExpertServiceList not found" });
    }
    res
      .status(200)
      .json({ message: "ExpertServiceList deleted successfully!" });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete ExpertServiceList",
      details: err.message,
    });
  }
};
