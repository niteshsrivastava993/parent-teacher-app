const mongoose = require("mongoose");
require("dotenv").config(); // make sure .env file is loaded

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI; // use variable from .env

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
