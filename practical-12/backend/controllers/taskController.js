const mongoose = require("mongoose");
const Task = require("../models/Task");

let memoryTasks = [
  {
    _id: "66f12a0123456789abcdef01",
    title: "Implement GitHub Actions CI Workflow",
    description: "Configure .github/workflows/ci.yml with checkout, setup-node, install, lint, and test",
    priority: "high",
    completed: true,
    assignedUser: "CI Automation",
    createdAt: new Date().toISOString()
  },
  {
    _id: "66f12a0123456789abcdef02",
    title: "Verify Red-to-Green Pipeline Lifecycle",
    description: "Demonstrate failing assertion followed by commit fixing the test",
    priority: "medium",
    completed: true,
    assignedUser: "CI Automation",
    createdAt: new Date().toISOString()
  }
];

let pipelineStatus = {
  lastRun: new Date().toISOString(),
  commitSha: "0fbc4ea",
  branch: "main",
  workflowName: "CI Pipeline",
  status: "success", // 'success' or 'failure'
  intentionalFailActive: false,
  totalTests: 5,
  passedTests: 5,
  failedTests: 0,
  logs: [
    "Run actions/checkout@v4 - Completed in 2s",
    "Run actions/setup-node@v4 - Node 18.x ready in 1s",
    "Run npm install - Installed 14 packages in 3s",
    "Run npm run lint - 0 syntax errors found",
    "Run npm test - PASS 5/5 assertions completed"
  ]
};

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
    const { title, description, priority, assignedUser } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Task title is required" });
    }

    if (isDbConnected()) {
      const task = await Task.create({
        title: title.trim(),
        description: description || "",
        priority: priority || "medium",
        assignedUser: assignedUser || "CI Automation"
      });
      return res.status(201).json({ success: true, message: "Task created successfully", data: task });
    }

    const newTask = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: title.trim(),
      description: description || "",
      priority: priority || "medium",
      completed: false,
      assignedUser: assignedUser || "CI Automation",
      createdAt: new Date().toISOString()
    };
    memoryTasks.unshift(newTask);
    return res.status(201).json({ success: true, message: "Task created successfully", data: newTask });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) return res.status(404).json({ success: false, message: "Task not found" });
      return res.status(200).json({ success: true, message: "Task deleted successfully" });
    }
    const idx = memoryTasks.findIndex(t => t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: "Task not found" });
    memoryTasks.splice(idx, 1);
    return res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// @desc    Get CI/CD Pipeline Telemetry
// @route   GET /api/ci/status
exports.getCiStatus = (req, res) => {
  res.status(200).json({
    success: true,
    pipeline: pipelineStatus
  });
};

// @desc    Toggle Intentional Test Failure Mode
// @route   POST /api/ci/toggle-fail
exports.toggleFailMode = (req, res) => {
  pipelineStatus.intentionalFailActive = !pipelineStatus.intentionalFailActive;
  if (pipelineStatus.intentionalFailActive) {
    pipelineStatus.status = "failure";
    pipelineStatus.passedTests = 4;
    pipelineStatus.failedTests = 1;
    pipelineStatus.logs = [
      "Run actions/checkout@v4 - Completed in 2s",
      "Run actions/setup-node@v4 - Node 18.x ready in 1s",
      "Run npm install - Installed dependencies in 3s",
      "Run npm run lint - 0 errors",
      "Run npm test - FAIL tests/intentional_fail.test.js",
      "  ✖ Expected status 500 but received 200 OK",
      "Error: Process completed with exit code 1."
    ];
  } else {
    pipelineStatus.status = "success";
    pipelineStatus.passedTests = 5;
    pipelineStatus.failedTests = 0;
    pipelineStatus.logs = [
      "Run actions/checkout@v4 - Completed in 2s",
      "Run actions/setup-node@v4 - Node 18.x ready in 1s",
      "Run npm install - Installed dependencies in 3s",
      "Run npm run lint - 0 syntax errors found",
      "Run npm test - PASS 5/5 assertions completed",
      "✔ All CI jobs passed! Green checkmark assigned."
    ];
  }
  pipelineStatus.lastRun = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: `Intentional failure mode set to: ${pipelineStatus.intentionalFailActive}`,
    pipeline: pipelineStatus
  });
};
