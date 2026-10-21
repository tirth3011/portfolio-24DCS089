const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high"
      },
      default: "medium"
    },
    completed: {
      type: Boolean,
      default: false
    },
    assignedUser: {
      type: String,
      trim: true,
      default: "DevOps Engineer"
    },
    containerHost: {
      type: String,
      default: () => process.env.HOSTNAME || "backend-container"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", TaskSchema);
