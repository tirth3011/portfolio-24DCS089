const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/awdf_practical6";
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} (${conn.connection.host})`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
