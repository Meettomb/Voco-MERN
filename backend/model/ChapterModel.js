import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
{
  languageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "learning_languages",
    required: true,
  },

  translations: {
    type: Map,
    of: String,
  },
},
{ timestamps: true }
);

export default mongoose.model("chapters", chapterSchema);