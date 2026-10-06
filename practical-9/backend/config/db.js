const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/awdf_practical9");
    console.log(`✔ [MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`✖ [MongoDB Connection Error]: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
