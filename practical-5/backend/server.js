const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes");

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(logger);

// Base Documentation Route
app.get("/", (req, res) => {
  res.status(200).json({
    project: "Practical 5: MongoDB Integration and Schema Design with Mongoose",
    student: "Tirth Patel (24DCS089)",
    course: "ITUE301 - AWDF",
    status: "Active",
    endpoints: {
      getAllTasks: "GET /api/tasks",
      getTaskById: "GET /api/tasks/:id",
      createTask: "POST /api/tasks",
      updateTask: "PUT /api/tasks/:id",
      deleteTask: "DELETE /api/tasks/:id"
    }
  });
});

// API Routes
app.use("/api/tasks", taskRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route '${req.originalUrl}' not found`
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Practical 5 server running on http://localhost:${PORT}`);
});
