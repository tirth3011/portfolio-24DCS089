const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

// Load environment configuration
dotenv.config();

// Attempt MongoDB Connection (via Docker Compose DNS or localhost)
connectDB();

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve interactive Docker dashboard from public folder
app.use(express.static(path.join(__dirname, "public")));

// Mount API routes
app.use("/api/tasks", taskRoutes);

// Health check endpoint for Docker Compose healthcheck
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "task-backend-container",
    containerHost: process.env.HOSTNAME || "localhost",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5011;

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=======================================================`);
    console.log(` 🐳 Practical 11 Docker Backend running on port ${PORT}`);
    console.log(` 🌐 Dashboard: http://localhost:${PORT}`);
    console.log(` 📦 API: http://localhost:${PORT}/api/tasks`);
    console.log(` 📡 Docker Telemetry: http://localhost:${PORT}/api/tasks/docker/status`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
