const Task = require("../models/Task");

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
exports.getAllTasks = async (req, res, next) => {
  try {
    const { completed, priority } = req.query;
    const filter = {};

    if (completed !== undefined) {
      filter.completed = completed === "true";
    }
    if (priority) {
      filter.priority = priority.toLowerCase();
    }

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

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with id '${req.params.id}' not found`
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

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, completed } = req.body;

    const task = await Task.create({
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

// @desc    Update task by ID
// @route   PUT /api/tasks/:id
// @access  Public
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with id '${req.params.id}' not found`
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

// @desc    Delete task by ID
// @route   DELETE /api/tasks/:id
// @access  Public
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with id '${req.params.id}' not found`
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
