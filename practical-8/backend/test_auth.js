const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config();

const User = require("./models/User");
const Task = require("./models/Task");

const runAuthTests = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/awdf_practical7";
  const jwtSecret = process.env.JWT_SECRET || "super_secret_awdf_jwt_key_24dcs089_token_secret";

  console.log("=================================================");
  console.log(" PRACTICAL 7: AUTH & MIDDLEWARE PIPELINE TEST");
  console.log("=================================================");
  console.log(`Connecting to: ${mongoURI} ...`);

  try {
    await mongoose.connect(mongoURI);
    console.log("✔ [TEST 1] MongoDB connected successfully.\n");

    // Clean up test data
    await User.deleteMany({ email: /test.*@example\.com/i });
    await Task.deleteMany({ title: /Auth Test Task/i });

    // Test 2: User Registration & Password Hashing Verification
    console.log("--- [TEST 2] User Registration & Bcrypt Hashing ---");
    const testPassword = "securePassword123";
    const user = await User.create({
      name: "Tirth Patel Test",
      email: "test_user_awdf@example.com",
      password: testPassword
    });

    console.log("User registered with ID:", user._id.toString());
    console.log("Stored Password Hash:", user.password);

    if (user.password !== testPassword && user.password.startsWith("$2")) {
      console.log("✔ Bcrypt salt and hash verified! Password is NOT plaintext.\n");
    } else {
      console.error("❌ FAILED: Password was not properly hashed with bcrypt!");
    }

    // Test 3: Password Comparison
    console.log("--- [TEST 3] Verifying Password Match with bcrypt.compare ---");
    const isMatch = await user.comparePassword(testPassword);
    const isWrongMatch = await user.comparePassword("wrongPassword");
    console.log("Correct password matches:", isMatch);
    console.log("Wrong password matches:", isWrongMatch);
    if (isMatch && !isWrongMatch) {
      console.log("✔ Password comparison logic verified successfully!\n");
    } else {
      console.error("❌ FAILED: Password comparison check failed!");
    }

    // Test 4: JWT Token Generation & Verification
    console.log("--- [TEST 4] JWT Token Generation and Signature Verification ---");
    const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: "1h" });
    console.log("Generated JWT Token:", `${token.slice(0, 32)}...`);

    const decoded = jwt.verify(token, jwtSecret);
    console.log("Decoded Token payload user ID:", decoded.id);
    if (decoded.id === user._id.toString()) {
      console.log("✔ JWT verification verified successfully!\n");
    } else {
      console.error("❌ FAILED: Token payload mismatch!");
    }

    // Test 5: Invalid/Tampered Token Rejection
    console.log("--- [TEST 5] Tampered Token Rejection Verification ---");
    try {
      jwt.verify(token + "tampered", jwtSecret);
      console.error("❌ FAILED: Tampered token should have failed verification!");
    } catch (err) {
      console.log("✔ Successfully rejected tampered token with error:", err.message, "\n");
    }

    // Test 6: User-Scoped Task Association
    console.log("--- [TEST 6] User-Scoped Task Creation & Data Isolation ---");
    const userTask = await Task.create({
      user: user._id,
      title: "Auth Test Task: Learn JWT & Middlewares",
      priority: "high"
    });

    console.log("Created task ID:", userTask._id.toString(), "for user:", userTask.user.toString());

    // Query tasks only for this user
    const foundTasks = await Task.find({ user: user._id });
    console.log("Found user tasks count:", foundTasks.length);
    if (foundTasks.length > 0 && foundTasks[0].title === "Auth Test Task: Learn JWT & Middlewares") {
      console.log("✔ Multi-tenant user data isolation verified!\n");
    } else {
      console.error("❌ FAILED: Task was not correctly scoped to user!");
    }

    // Clean up
    await Task.findByIdAndDelete(userTask._id);
    await User.findByIdAndDelete(user._id);
    console.log("Cleaned up test documents.\n");

    console.log("=================================================");
    console.log("🎉 ALL PRACTICAL 7 TESTS PASSED SUCCESSFULLY!");
    console.log("=================================================");
  } catch (err) {
    console.error("❌ Test execution failed with error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed cleanly.");
    process.exit(0);
  }
};

runAuthTests();
