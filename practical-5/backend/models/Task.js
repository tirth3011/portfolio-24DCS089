const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"]
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be either 'low', 'medium', or 'high'"
      },
      default: "medium"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

// Pre-save hook: automatically trims whitespace from title and normalizes fields
taskSchema.pre("save", function (next) {
  if (this.title) {
    this.title = this.title.trim();
  }
  if (this.description) {
    this.description = this.description.trim();
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);
