const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const registerTaskListeners = require("./events/listeners");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load environment configuration
dotenv.config();

// Connect to MongoDB
connectDB();

// Register EventEmitter listeners at server startup
registerTaskListeners();

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve interactive public dashboard
app.use(express.static(path.join(__dirname, "public")));

// Mount API routes
app.use("/api/tasks", taskRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Practical 10 Event-Driven Processing API is operational",
    uptime: process.uptime()
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

// Only listen if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` ⚡ Practical 10 Event Server running on port ${PORT}`);
    console.log(` 🌐 Dashboard: http://localhost:${PORT}`);
    console.log(` 📦 API: http://localhost:${PORT}/api/tasks`);
    console.log(` 📡 Event Telemetry: http://localhost:${PORT}/api/tasks/events/telemetry`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
