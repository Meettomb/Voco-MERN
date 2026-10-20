
import mongoose from "mongoose";

const conversationMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const performanceSchema = new mongoose.Schema(
  {
    overallScore: Number,
    grammarScore: Number,
    vocabularyScore: Number,
    fluencyScore: Number,
    conversationQualityScore: Number,
    strengths: [String],
    improvements: [String],
    practiceWords: [String],
    feedback: String,
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_table",
      required: true,
      index: true,
    },
    language: {
      type: String,
      enum: ["en", "hi"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "analyzing", "completed"],
      default: "active",
      index: true,
    },
    messages: {
      type: [conversationMessageSchema],
      default: [],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    performance: {
      type: performanceSchema,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
