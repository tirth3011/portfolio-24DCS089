const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve interactive public dashboard
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Practical 9 Caching API is operational",
    uptime: process.uptime()
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5009;

// Only start listening if executed directly (not when required for tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` 🚀 Practical 9 Caching Server running on port ${PORT}`);
    console.log(` 🌐 Dashboard: http://localhost:${PORT}`);
    console.log(` 📦 API: http://localhost:${PORT}/api/tasks`);
    console.log(` 📊 Cache Stats: http://localhost:${PORT}/api/tasks/cache/stats`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
