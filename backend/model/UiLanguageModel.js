import mongoose from "mongoose";

const uiLanguageSchema = mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    englishName: {
      type: String,
      trim: true,
    },

    nativeName: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const uiLanguageData = mongoose.model("ui_language_table", uiLanguageSchema);

export default uiLanguageData;
