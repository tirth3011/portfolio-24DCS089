const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const aiRoutes = require("./routes/aiRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve interactive AI dashboard
app.use(express.static(path.join(__dirname, "public")));

// Mount API routes
app.use("/api/ai", aiRoutes);
app.use("/api/tasks", taskRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "practical-13-ai-backend",
    aiConfigured: true,
    disclaimerEnforced: true,
    uptime: process.uptime()
  });
});

// Central Error Handler (Ensures server resilience)
app.use((err, req, res, next) => {
  console.error("✖ [API Exception]:", err.message);
  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

const PORT = process.env.PORT || 5013;

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=======================================================`);
    console.log(` ✨ Practical 13 AI Integration Server running on port ${PORT}`);
    console.log(` 🌐 Interactive AI Dashboard: http://localhost:${PORT}`);
    console.log(` 🤖 AI Endpoint: POST http://localhost:${PORT}/api/ai/generate-description`);
    console.log(` 🎯 AI Metadata: POST http://localhost:${PORT}/api/ai/suggest-metadata`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
