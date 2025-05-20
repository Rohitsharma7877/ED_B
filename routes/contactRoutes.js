// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Create a new contact submission
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Simple validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      message
    });

    await newContact.save();
    
    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you soon.",
      data: newContact
    });
  } catch (error) {
    console.error("Error saving contact form:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
});

// Get all contact submissions (for admin)
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
});

// Update contact status (for admin)
router.put("/:id", async (req, res) => {
  try {
    const { status, responded } = req.body;
    
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, responded },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ 
        success: false,
        message: "Contact not found" 
      });
    }

    res.json({
      success: true,
      message: "Contact updated successfully",
      data: updatedContact
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
});

// Delete a contact submission (for admin)
router.delete("/:id", async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({ 
        success: false,
        message: "Contact not found" 
      });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully",
      data: deletedContact
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
});

module.exports = router;