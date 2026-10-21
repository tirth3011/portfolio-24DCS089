const mongoose = require("mongoose");

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || "mongodb://mongodb:27017/taskdb_p11";
  const fallbackUri = process.env.LOCAL_MONGO_URI || "mongodb://localhost:27017/taskdb_p11";

  // Attempt connection with primary URI (e.g., Docker service name 'mongodb')
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✔ [MongoDB] Connected via Compose Service: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`⚠ [MongoDB] Compose DNS '${primaryUri}' unreachable: ${err.message}`);
    console.log(`🔄 [MongoDB] Attempting fallback to local host database: ${fallbackUri}`);

    try {
      const conn = await mongoose.connect(fallbackUri, {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`✔ [MongoDB] Connected via Localhost: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (fallbackErr) {
      console.error(`✖ [MongoDB Error]: All database connection targets failed (${fallbackErr.message})`);
      console.log(`ℹ [MongoDB In-Memory Fallback]: Backend will operate in memory-safe state.`);
      return null;
    }
  }
};

module.exports = connectDB;
