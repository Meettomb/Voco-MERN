import mongoose from "mongoose";

const UserProgressSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_table",
    required: true,
    unique: true
  },

  learningLanguages: [
    {
      languageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "learning_languages",
        required: true,
      },

      completedChapters: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "chapters",
        }
      ],

      isCourseCompleted: {
        type: Boolean,
        default: false,
      },
      
      completedAt: {
        type: Date,
        default: null,
      }
    }
  ]

}, {
  timestamps: true,
});

export default mongoose.model("UserProgress", UserProgressSchema);