const express = require("express");
const db = require("./config/db");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
// const logRequest = require('./Middleware/requestLogger');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
  origin: "http://localhost:3000", // or your frontend URL
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware function to log requests
const logRequest = (req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}`
  );
  next();
};
app.use(logRequest);

// Import routers
const bookingRoutes = require("./routes/bookingRoutes");
const formRoutes = require("./routes/formRoutes");
const emailRoutes = require("./routes/emailRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const homeCollectionRoutes = require("./routes/homeCollectionRoutes");
const registrationRoutes = require("./routes/OfflineregistrationRoutes");
const personRouter = require("./routes/personRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const expertServiceListRoutes = require("./routes/expertServiceListRoutes");
const uploadPrescriptionRoutes = require("./routes/uploadPrescriptionRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const serviceBookingRoutes = require("./routes/serviceBookingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const careerRoutes = require("./routes/careerRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

// use Routes
app.use("/person", personRouter);
app.use("/api/bookings", bookingRoutes);
app.use("/api/form-data", formRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/book-appointment", appointmentRoutes);
app.use("/api/home-collection", homeCollectionRoutes);
app.use("/api/", registrationRoutes);
app.use("/api", subCategoryRoutes);
app.use("/api", categoryRoutes);
app.use("/api", expertServiceListRoutes);
app.use("/api", uploadPrescriptionRoutes);
app.use("/api/ambulance-services", ambulanceRoutes);
app.use("/api/service-bookings", serviceBookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", careerRoutes);
app.use("/api", resumeRoutes);

// Create uploads directory if it doesn't exist
const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads/resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});