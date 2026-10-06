const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getCacheStats,
  clearCache,
  runBenchmark
} = require("../controllers/taskController");

// Debug & utility endpoints (must precede :id route)
router.get("/cache/stats", getCacheStats);
router.delete("/cache/clear", clearCache);
router.get("/benchmark/compare", runBenchmark);

// Standard REST CRUD endpoints
router.route("/")
  .get(getAllTasks)
  .post(createTask);

router.route("/:id")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
