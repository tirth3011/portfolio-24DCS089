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
        values: ["low", "medium", "high", "urgent"],
        message: "Priority must be low, medium, high, or urgent"
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
      default: "AI Assistant"
    },
    isAiGenerated: {
      type: Boolean,
      default: false
    },
    aiProvider: {
      type: String,
      default: "None"
    },
    estimatedHours: {
      type: Number,
      default: 2
    },
    tags: {
      type: [String],
      default: ["general"]
    },
    aiReviewedByUser: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", TaskSchema);
