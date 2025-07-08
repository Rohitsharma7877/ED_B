const express = require("express");
const db = require("./config/db");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();


// ✅ Updated CORS Setup

const allowedOrigins = [
  "https://expertdiagnostics.in",
  "https://www.expertdiagnostics.in",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Middleware

app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Root Route

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});


// Request Logger

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


// Routes

const bookingRoutes = require("./routes/bookingRoutes");
const formRoutes = require("./routes/formRoutes");
const emailRoutes = require("./routes/emailRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const homeCollectionRoutes = require("./routes/homeCollectionRoutes");
const registrationRoutes = require("./routes/OfflineregistrationRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const personRouter = require("./routes/personRoutes");
const expertServiceListRoutes = require("./routes/expertServiceListRoutes");
const uploadPrescriptionRoutes = require("./routes/uploadPrescriptionRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const serviceBookingRoutes = require("./routes/serviceBookingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const careerRoutes = require("./routes/careerRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

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


// Uploads directory

const uploadDir = path.join(__dirname, "uploads/resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Error Handling (404)

app.use((req, res, next) => {
  console.log("❌ Global unmatched route:", req.method, req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});


// Start Server

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
