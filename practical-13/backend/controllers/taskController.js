const mongoose = require("mongoose");
const Task = require("../models/Task");

let memoryTasks = [
  {
    _id: "66f13a0123456789abcdef01",
    title: "AI API Integration & Graceful Failure Handling",
    description: "Connect Node/Express backend to external AI API with fallback heuristic engine and PII sanitization",
    priority: "high",
    completed: true,
    assignedUser: "AI Assistant",
    isAiGenerated: true,
    aiProvider: "Intelligent Fallback Engine",
    estimatedHours: 4,
    tags: ["ai", "security", "node"],
    aiReviewedByUser: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "66f13a0123456789abcdef02",
    title: "Responsible AI Governance & UI Disclaimer",
    description: "Display prominent AI review warnings and enforce client rate limiting to avoid API quota drain",
    priority: "medium",
    completed: false,
    assignedUser: "AI Assistant",
    isAiGenerated: true,
    aiProvider: "Gemini 1.5 Flash",
    estimatedHours: 2,
    tags: ["governance", "ui/ux"],
    aiReviewedByUser: true,
    createdAt: new Date().toISOString()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getAllTasks = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: tasks.length, data: tasks });
    }
    return res.status(200).json({ success: true, count: memoryTasks.length, data: memoryTasks });
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ success: false, message: "Task not found" });
      return res.status(200).json({ success: true, data: task });
    }
    const task = memoryTasks.find(t => t._id === req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    return res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, isAiGenerated, aiProvider, estimatedHours, tags } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Task title is required" });
    }

    if (isDbConnected()) {
      const task = await Task.create({
        title: title.trim(),
        description: description || "",
        priority: priority || "medium",
        assignedUser: "AI Assistant",
        isAiGenerated: !!isAiGenerated,
        aiProvider: aiProvider || "None",
        estimatedHours: estimatedHours || 2,
        tags: tags || ["general"],
        aiReviewedByUser: true
      });
      return res.status(201).json({ success: true, message: "Task saved successfully", data: task });
    }

    const newTask = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: title.trim(),
      description: description || "",
      priority: priority || "medium",
      completed: false,
      assignedUser: "AI Assistant",
      isAiGenerated: !!isAiGenerated,
      aiProvider: aiProvider || "None",
      estimatedHours: estimatedHours || 2,
      tags: tags || ["general"],
      aiReviewedByUser: true,
      createdAt: new Date().toISOString()
    };
    memoryTasks.unshift(newTask);
    return res.status(201).json({ success: true, message: "Task saved successfully", data: newTask });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) return res.status(404).json({ success: false, message: "Task not found" });
      return res.status(200).json({ success: true, message: "Task deleted" });
    }
    const idx = memoryTasks.findIndex(t => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: "Task not found" });
    memoryTasks.splice(idx, 1);
    return res.status(200).json({ success: true, message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
