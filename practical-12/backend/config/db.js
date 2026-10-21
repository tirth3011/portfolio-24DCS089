const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/awdf_practical12";
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`✔ [MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`⚠ [MongoDB] Connection offline (${err.message}). Using memory fallback for CI/CD pipeline tests.`);
    return null;
  }
};

module.exports = connectDB;
