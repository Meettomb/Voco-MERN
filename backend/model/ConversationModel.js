
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
    inputMode: {
      type: String,
      enum: ["speech", "text", null],
      default: null,
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
    pronunciationScore: {
      type: Number,
      default: null,
    },
    comprehensionScore: Number,
    conversationQualityScore: Number,

    interactionMode: {
      type: String,
      enum: ["speech", "text", "mixed"],
      default: "text",
    },

    learnerMessageCount: {
      type: Number,
      default: 0,
    },

    spokenMessageCount: {
      type: Number,
      default: 0,
    },

    typedMessageCount: {
      type: Number,
      default: 0,
    },

    strengths: [String],
    improvements: [String],
    practiceWords: [String],

    corrections: [
      {
        original: String,
        corrected: String,
        explanation: String,
      },
    ],

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
