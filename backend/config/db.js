const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDB connected: ${connect.connection.host}`);
    return true;
  } catch (err) {
    console.log("Error: ", err.message);

    if (process.env.USE_SEED_FALLBACK === "true") {
      console.log("MongoDB unavailable. Continuing with seed fallback mode.");
      return false;
    }

    process.exit(1);
  }
};

module.exports = connectDB;
