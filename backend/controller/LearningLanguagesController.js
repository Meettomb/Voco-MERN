import LearningLanguagesModel from '../model/LearningLanguagesModel.js';
import mongoose from "mongoose";

export const addLearningLanguages = async (req, res) => {
    try {

        const { english, native, code, chapters } = req.body;

        if (!english || !native || !code) {
            return res.status(400).json({
                status: 0,
                message: "All fields required",
            });
        }

        const exist = await LearningLanguagesModel.findOne({ code });

        if (exist) {
            return res.status(409).json({
                status: 0,
                message: "Language already exists",
            });
        }

        const newLearningLanguages = new LearningLanguagesModel({
            english,
            native,
            code,
            chapters
        });

        const saveLearningLanguages = await newLearningLanguages.save();

        res.status(201).json({
            status: 1,
            message: "Learning Language Added Successfully",
            data: saveLearningLanguages,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: 0,
            message: "Server error",
        });
    }
};

export const getAllLearningLanguages = async (req, res) => {
    try {

        const data = await LearningLanguagesModel
            .find()
            .sort({ createdAt: -1 });

        if (!data || data.length === 0) {
            return res.status(404).json({
                status: 0,
                message: "No learning languages found",
            });
        }

        res.status(200).json({
            status: 1,
            message: "Learning languages fetched successfully",
            data: data,
        });

    } catch (error) {

        console.log("getAllLearningLanguages error:", error);

        res.status(500).json({
            status: 0,
            message: "Internal server error",
        });
    }
};


export const getLearningLanguagesById = async (req, res) => {
    try {

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({
                status: 0,
                message: "ID is required",
            });
        }

        // check valid Mongo ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                status: 0,
                message: "Invalid ID format",
            });
        }

        const data = await LearningLanguagesModel.findById(id);

        if (!data) {
            return res.status(404).json({
                status: 0,
                message: "Learning language not found",
            });
        }

        res.status(200).json({
            status: 1,
            message: "Learning language fetched successfully",
            data: data,
        });

    } catch (error) {

        console.log("getLearningLanguagesById error:", error);

        // mongoose cast error
        if (error.name === "CastError") {
            return res.status(400).json({
                status: 0,
                message: "Invalid ID",
            });
        }

        res.status(500).json({
            status: 0,
            message: "Internal server error",
        });
    }
};

export const deleteLearningLangaugebyId = async (req, res) => {

    try {

        const deleteLangauge = await LearningLanguagesModel.findByIdAndDelete(req.params.id)

        if (!deleteLangauge) {
            return res.status(404).json({
                status: 0,
                message: "Language not found",
            });
        }

        res.status(200).json({
            status: 1,
            message: "Language deleted successfully",
            data: deleteLangauge,
        });
    } catch (error) {

        if (error.name === "CastError") {
            return res.status(400).json({
                status: 0,
                message: "Invalid ID",
            });
        }

        console.log("Delete Error:", error);

        res.status(500).json({
            status: 0,
            message: "Server error",
        });
    }
}

export const deleteLearningLangaugeChapterbyId = async (req, res) => {
  try {

    const { langId, chapterId } = req.params;

    if (!langId || !chapterId) {
      return res.status(400).json({
        status: 0,
        message: "IDs required",
      });
    }

    const language = await LearningLanguagesModel.findById(langId);

    if (!language) {
      return res.status(404).json({
        status: 0,
        message: "Language not found",
      });
    }

    language.chapters = language.chapters.filter(
      ch => ch._id.toString() !== chapterId
    );

    await language.save();

    res.json({
      status: 1,
      message: "Chapter deleted successfully",
      data: language,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      status: 0,
      message: "Server error",
    });

  }
};

export const updateLearningLangauge = async (req, res) => {
  try {

    const { id } = req.params;

    const { english, native, code, chapters } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "ID required",
      });
    }

    if (!english || !native || !code) {
      return res.status(400).json({
        status: 0,
        message: "Required fields missing",
      });
    }

    const language = await LearningLanguagesModel.findById(id);

    if (!language) {
      return res.status(404).json({
        status: 0,
        message: "Language not found",
      });
    }

    // update fields
    language.english = english;
    language.native = native;
    language.code = code;

    if (chapters) {
      language.chapters = chapters;
    }

    const updated = await language.save();

    res.status(200).json({
      status: 1,
      message: "Language updated successfully",
      data: updated,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      status: 0,
      message: "Server error",
    });

  }
};