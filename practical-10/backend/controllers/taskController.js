const Task = require("../models/Task");
const taskEvents = require("../events/events");

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Public
 */
exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Public
 */
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

/**
 * @desc    Create new task & Emit Asynchronous Background Event
 * @route   POST /api/tasks
 * @access  Public
 */
exports.createTask = async (req, res, next) => {
  const reqStart = process.hrtime.bigint();
  try {
    const { title, description, priority, completed, assignedUser, customDelayMs } = req.body;

    // 1. Persist task document in MongoDB
    const task = await Task.create({
      title,
      description,
      priority,
      completed,
      assignedUser: assignedUser || "Tirth Patel (24DCS089)"
    });

    const apiResponseTimestamp = new Date().toISOString();
    const reqEnd = process.hrtime.bigint();
    const roundTripMs = Number(reqEnd - reqStart) / 1e6;

    console.log(`[API Response] 201 Created sent at : ${apiResponseTimestamp} (Latency: ${roundTripMs.toFixed(2)} ms)`);

    // 2. Dispatch HTTP response IMMEDIATELY to client (non-blocking)
    res.status(201).json({
      success: true,
      message: "Task created and response dispatched instantly",
      apiResponseTimestamp,
      latencyMs: Number(roundTripMs.toFixed(2)),
      data: task
    });

    // 3. Emit asynchronous background event
    // Using setImmediate ensures current HTTP response socket flushing completes first
    setImmediate(() => {
      taskEvents.emit("task-created", {
        task,
        apiResponseTimestamp,
        user: task.assignedUser,
        delayMs: customDelayMs !== undefined ? parseInt(customDelayMs, 10) : undefined
      });
    });

  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update task & Emit 'task-updated' event
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
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

    const apiResponseTimestamp = new Date().toISOString();
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      apiResponseTimestamp,
      data: task
    });

    // Emit event asynchronously
    setImmediate(() => {
      taskEvents.emit("task-updated", {
        task,
        apiResponseTimestamp
      });
    });

  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Delete task & Emit 'task-deleted' event (Supplementary Problem 1)
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task with id '${req.params.id}' not found`
      });
    }

    const apiResponseTimestamp = new Date().toISOString();
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      apiResponseTimestamp,
      deletedId: req.params.id,
      title: task.title
    });

    // Emit event asynchronously
    setImmediate(() => {
      taskEvents.emit("task-deleted", {
        taskTitle: task.title,
        taskId: task._id.toString(),
        apiResponseTimestamp
      });
    });

  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Simulate Event Error Handling (Supplementary Problem 2: error listener)
 * @route   POST /api/tasks/error-trigger
 * @access  Public
 */
exports.triggerErrorEvent = (req, res) => {
  const message = req.body.message || "Simulated asynchronous notification channel timeout";
  
  // Emit built-in 'error' event to verify registered error listener catches it
  taskEvents.emit("error", new Error(message));

  res.status(200).json({
    success: true,
    message: "Error event dispatched and safely captured by registered listener without crash."
  });
};

/**
 * @desc    Retrieve telemetry logs of background event executions
 * @route   GET /api/tasks/events/telemetry
 * @access  Public
 */
exports.getEventTelemetry = (req, res) => {
  res.status(200).json({
    success: true,
    count: taskEvents.getLogs().length,
    logs: taskEvents.getLogs()
  });
};

/**
 * @desc    Clear telemetry logs
 * @route   DELETE /api/tasks/events/telemetry
 * @access  Public
 */
exports.clearEventTelemetry = (req, res) => {
  taskEvents.clearLogs();
  res.status(200).json({
    success: true,
    message: "Event telemetry logs reset"
  });
};
