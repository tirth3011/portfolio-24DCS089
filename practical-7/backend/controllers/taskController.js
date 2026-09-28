const Task = require("../models/Task");

// GET /api/tasks (user-scoped)
exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const filter = { user: req.user.id };

    if (status === "completed") filter.completed = true;
    if (status === "pending") filter.completed = false;
    if (priority && priority !== "all") filter.priority = priority.toLowerCase();

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id (user-scoped)
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id '${req.params.id}'`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks (user-scoped)
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, completed } = req.body;

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      priority,
      completed
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id (user-scoped)
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id '${req.params.id}'`
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id (user-scoped)
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id '${req.params.id}'`
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task
    });
  } catch (err) {
    next(err);
  }
};
