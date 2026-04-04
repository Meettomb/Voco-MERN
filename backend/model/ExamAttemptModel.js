import mongoose from "mongoose";

const examAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
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