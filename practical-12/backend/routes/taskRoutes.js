const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTask,
  getCiStatus,
  toggleFailMode
} = require("../controllers/taskController");

// CI/CD Telemetry endpoints
router.get("/ci/status", getCiStatus);
router.post("/ci/toggle-fail", toggleFailMode);

// REST CRUD endpoints
router.route("/")
  .get(getAllTasks)
  .post(createTask);

router.route("/:id")
  .get(getTaskById)
  .delete(deleteTask);

module.exports = router;
