const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  triggerErrorEvent,
  getEventTelemetry,
  clearEventTelemetry
} = require("../controllers/taskController");

// Telemetry & Utility routes (must precede :id)
router.get("/events/telemetry", getEventTelemetry);
router.delete("/events/telemetry", clearEventTelemetry);
router.post("/error-trigger", triggerErrorEvent);

// Standard REST CRUD endpoints
router.route("/")
  .get(getAllTasks)
  .post(createTask);

router.route("/:id")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
