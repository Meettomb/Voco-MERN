import mongoose from "mongoose";

const mcqsSchema = new mongoose.Schema(
  {
    chapterId: {
      type: String,
      required: [true, "Chapter ID is Required"],
      trim: true,
    },

    difficultyLevel: {
      type: String,
      required: true,
      trim: true,
    },

    questions: [
      {
        question: {
          type: Map,
          of: String,
          required: true,
        },

        options: [
          {
            type: Map,
            of: String,
            required: true,
          },
        ],

        correctAnswer: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("MCQs", mcqsSchema);