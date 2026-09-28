const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes");

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Practical 6 Full-Stack Backend API is running",
    endpoints: {
      tasks: "/api/tasks"
    }
  });
});

app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.originalUrl} not found`
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Practical 6 backend running on http://localhost:${PORT}`);
});
