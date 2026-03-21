import mongoose from "mongoose";

const LearningLanguagesModel = new mongoose.Schema(
    {
        english: {
            type: String,
            required: [true, "Language is required"],
            trim: true,
        },

        native: {
            type: String,
            required: [true, "Language is required in native"],
            trim: true,
        },

        code: {
            type: String,
            required: [true, "Language code is required"],
            trim: true,
            lowercase: true,
        },

        chapters: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "chapters",
                require:[true, "Chapter id is Required"]
            }
        ]
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "learning_languages",
    LearningLanguagesModel
);