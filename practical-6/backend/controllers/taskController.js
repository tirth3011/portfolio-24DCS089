const Task = require("../models/Task");

// GET /api/tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const filter = {};

    if (status === "completed") {
      filter.completed = true;
    } else if (status === "pending") {
      filter.completed = false;
    }

    if (priority && priority !== "all") {
      filter.priority = priority.toLowerCase();
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
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

// GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: `Task not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
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

// PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) {
      return res.status(404).json({ success: false, error: `Task not found with id ${req.params.id}` });
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

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: `Task not found with id ${req.params.id}` });
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
