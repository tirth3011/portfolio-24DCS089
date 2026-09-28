const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [2, "Title must have at least 2 characters"]
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
        message: "Priority must be low, medium, or high"
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

taskSchema.pre("save", function (next) {
  if (this.title) this.title = this.title.trim();
  if (this.description) this.description = this.description.trim();
  next();
});

module.exports = mongoose.model("Task", taskSchema);
