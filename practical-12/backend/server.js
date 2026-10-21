const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve interactive CI dashboard
app.use(express.static(path.join(__dirname, "public")));

// Mount API routes
app.use("/api/tasks", taskRoutes);

// Health check endpoint tested by CI suite
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "practical-12-ci-backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5012;

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=======================================================`);
    console.log(` 🚀 Practical 12 CI/CD Server running on port ${PORT}`);
    console.log(` 🌐 Dashboard: http://localhost:${PORT}`);
    console.log(` 🧪 Run CI Simulation: npm run test:pipeline`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
