import mongoose from "mongoose";

const examAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  // For chapter exam
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },

  // For final exam (NEW)
  langId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },

  // Identify exam type
  examType: {
    type: String,
    enum: ["chapter", "final"],
    required: true,
  },

  mcqIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MCQs",
    },
  ],

  answers: [
    {
      mcqId: mongoose.Schema.Types.ObjectId,
      questionIndex: Number,
      selectedOption: Number,
    },
  ],

  startTime: Date,
  endTime: Date,

  isCompleted: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

export default mongoose.model("ExamAttempt", examAttemptSchema);