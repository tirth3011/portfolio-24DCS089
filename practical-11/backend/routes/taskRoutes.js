const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getDockerTelemetry
} = require("../controllers/taskController");

// Docker Telemetry endpoint
router.get("/docker/status", getDockerTelemetry);

// REST CRUD endpoints
router.route("/")
  .get(getAllTasks)
  .post(createTask);

router.route("/:id")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
