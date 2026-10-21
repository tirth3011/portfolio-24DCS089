const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTask
} = require("../controllers/taskController");

router.route("/")
  .get(getAllTasks)
  .post(createTask);

router.route("/:id")
  .get(getTaskById)
  .delete(deleteTask);

module.exports = router;
