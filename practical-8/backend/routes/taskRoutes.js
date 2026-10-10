const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");
const { validateTask } = require("../middleware/validateInput");

// Protect all task endpoints with authentication middleware
router.use(protect);

router.route("/")
  .get(getAllTasks)
  .post(validateTask, createTask);

router.route("/:id")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
