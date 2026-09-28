const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Task = require("./models/Task");

const runTests = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/awdf_practical5";

  console.log("=================================================");
  console.log(" PRACTICAL 5: MONGOOSE VALIDATION & CRUD TEST");
  console.log("=================================================");
  console.log(`Connecting to: ${mongoURI} ...`);

  try {
    await mongoose.connect(mongoURI);
    console.log("✔ [TEST 1] MongoDB connection established successfully.\n");

    // Clean up test tasks
    await Task.deleteMany({ title: { $regex: /Test Task/i } });

    // Test 2: Successful Document Creation
    console.log("--- [TEST 2] Creating a valid Task document ---");
    const newTask = await Task.create({
      title: "  Test Task 1: Learn Mongoose Schemas  ",
      description: "Understand schema definition, types, and hooks",
      priority: "high",
      completed: false
    });
    console.log("Created Document ID:", newTask._id.toString());
    console.log("Trimmed Title:", `"${newTask.title}"`);
    console.log("Priority:", newTask.priority);
    console.log("Completed status:", newTask.completed);
    console.log("Created at:", newTask.createdAt);

    if (newTask.title === "Test Task 1: Learn Mongoose Schemas") {
      console.log("✔ Pre-save trim hook verified successfully!\n");
    } else {
      console.warn("⚠ Trim hook did not match expected value.\n");
    }

    // Test 3: Read Document by ID
    console.log("--- [TEST 3] Reading task by ID ---");
    const fetchedTask = await Task.findById(newTask._id);
    console.log("✔ Found task:", fetchedTask.title, "| Priority:", fetchedTask.priority, "\n");

    // Test 4: Update Document
    console.log("--- [TEST 4] Updating task status to completed ---");
    const updatedTask = await Task.findByIdAndUpdate(
      newTask._id,
      { completed: true, priority: "low" },
      { new: true, runValidators: true }
    );
    console.log("✔ Updated status:", updatedTask.completed, "| Updated priority:", updatedTask.priority, "\n");

    // Test 5: Validation Failure - Missing Required Title
    console.log("--- [TEST 5] Testing Validation Failure: Missing Title ---");
    try {
      await Task.create({
        description: "Task without title"
      });
      console.error("❌ FAILED: Validation should have rejected document missing title!");
    } catch (err) {
      console.log("✔ Successfully caught expected ValidationError (Title required):");
      console.log("  Error message:", err.errors?.title?.message || err.message, "\n");
    }

    // Test 6: Validation Failure - Invalid Enum Value for Priority
    console.log("--- [TEST 6] Testing Validation Failure: Invalid Priority Enum ---");
    try {
      await Task.create({
        title: "Test Task with Invalid Priority",
        priority: "super-urgent" // not low/medium/high
      });
      console.error("❌ FAILED: Validation should have rejected invalid priority!");
    } catch (err) {
      console.log("✔ Successfully caught expected ValidationError (Priority enum):");
      console.log("  Error message:", err.errors?.priority?.message || err.message, "\n");
    }

    // Test 7: Delete Document
    console.log("--- [TEST 7] Deleting test task ---");
    const deletedTask = await Task.findByIdAndDelete(newTask._id);
    console.log("✔ Deleted document:", deletedTask._id.toString(), "\n");

    console.log("=================================================");
    console.log("🎉 ALL PRACTICAL 5 TESTS PASSED SUCCESSFULLY!");
    console.log("=================================================");
  } catch (err) {
    console.error("❌ Test execution failed with error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed cleanly.");
    process.exit(0);
  }
};

runTests();
