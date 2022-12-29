const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      dbName: process.env.DB_NAME,
      autoIndex: true,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 60000,
    });
    console.log(`[database] connected successfully to MongoDB`);
  } catch (err) {
    console.log(`[database] could not connect due to [${err.message}]`);
  }
};

module.exports = connectDatabase;
