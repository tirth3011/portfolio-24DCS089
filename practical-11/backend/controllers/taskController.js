const mongoose = require("mongoose");
const os = require("os");
const Task = require("../models/Task");

// In-memory fallback store if MongoDB container is offline
let memoryTasks = [
  {
    _id: "66f11a0123456789abcdef01",
    title: "Docker Compose Full-Stack Orchestration",
    description: "Launch frontend, backend, and mongodb via single docker-compose up --build command",
    priority: "high",
    completed: true,
    assignedUser: "DevOps Engineer",
    containerHost: "backend-container-5011",
    createdAt: new Date().toISOString()
  },
  {
    _id: "66f11a0123456789abcdef02",
    title: "Configure Bridge Network & Named Volumes",
    description: "Enable inter-container DNS and persist Mongo data in named volume mongo-data",
    priority: "medium",
    completed: false,
    assignedUser: "DevOps Engineer",
    containerHost: "backend-container-5011",
    createdAt: new Date().toISOString()
  }
];

// Helper to check MongoDB connection state
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: tasks.length,
        source: "MongoDB (mongo-data volume)",
        data: tasks
      });
    }

    return res.status(200).json({
      success: true,
      count: memoryTasks.length,
      source: "In-Memory Fallback (Container Cache)",
      data: memoryTasks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      return res.status(200).json({ success: true, data: task });
    }

    const task = memoryTasks.find(t => t._id === req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    return res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, assignedUser } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const containerHostname = process.env.HOSTNAME || os.hostname();

    if (isDbConnected()) {
      const newTask = await Task.create({
        title: title.trim(),
        description: description || "",
        priority: priority || "medium",
        assignedUser: assignedUser || "DevOps Engineer",
        containerHost: containerHostname
      });

      return res.status(201).json({
        success: true,
        message: "Task created successfully in containerized MongoDB",
        data: newTask
      });
    }

    const newTask = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: title.trim(),
      description: description || "",
      priority: priority || "medium",
      completed: false,
      assignedUser: assignedUser || "Tirth Patel (24DCS089)",
      containerHost: containerHostname,
      createdAt: new Date().toISOString()
    };
    memoryTasks.unshift(newTask);

    return res.status(201).json({
      success: true,
      message: "Task created successfully in container RAM fallback",
      data: newTask
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      return res.status(200).json({ success: true, data: task });
    }

    const index = memoryTasks.findIndex(t => t._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    memoryTasks[index] = { ...memoryTasks[index], ...req.body };
    return res.status(200).json({ success: true, data: memoryTasks[index] });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      return res.status(200).json({ success: true, message: "Task deleted from MongoDB" });
    }

    const index = memoryTasks.findIndex(t => t._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    memoryTasks.splice(index, 1);
    return res.status(200).json({ success: true, message: "Task removed from memory fallback" });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Docker Container Telemetry
// @route   GET /api/docker/status
exports.getDockerTelemetry = (req, res) => {
  const memUsage = process.memoryUsage();
  res.status(200).json({
    success: true,
    container: {
      hostname: process.env.HOSTNAME || os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      memoryRssMb: (memUsage.rss / 1024 / 1024).toFixed(2),
      memoryHeapMb: (memUsage.heapUsed / 1024 / 1024).toFixed(2)
    },
    orchestration: {
      network: "app-network (Bridge)",
      serviceName: "backend",
      mappedPort: "5011:5011",
      mongoService: "mongodb:27017",
      mongoConnected: isDbConnected(),
      volumeMount: "mongo-data -> /data/db",
      singleCommandDeploy: "docker-compose up --build"
    },
    timestamp: new Date().toISOString()
  });
};
