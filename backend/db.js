import mongoose from "mongoose";
import dotenv from "dotenv";
import runWorker from "./workers/ConversationWorker.js";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Start background report worker.
    runWorker().catch((error) => {
      console.error("Conversation worker stopped:", error);
    });

  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};


export default connectDB;