import mongoose from "mongoose";

const learningWordsSchema = new mongoose.Schema(
    {
        learningWordsLangauge:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"learning_languages",
            required: [true, "Lerning Langaue is Required"],
            trim: true
        },
        
        chapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"chapters",
            required: [true, "Chapter ID is Required"],
            trim: true
        },

        contentType: {
            type: String,
            required: true,
        },

        grammarContent: {
            type: Map,
            of: String,
            default: {}
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