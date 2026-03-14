import mongoose from "mongoose";

const learningWordsSchema = new mongoose.Schema(
    {
        chapterId: {
            type: String,
            required: [true, "Chapter ID is Required"],
            trim: true
        },

        contentType: {
            type: String,
            required: true, 
        },

        grammarContent: {
            type: String,
            default: "",
        },

        difficulties: [
            {
                level: {
                    type: String,
                    required: [true, "Difficulty level is required"],
                    trim: true
                },

                words: [
                    {
                        type: Map,
                        required: [true, "English word is required"],
                        trim: true
                    }
                ]
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model("LearningWords", learningWordsSchema);