import LearningLanguagesModel from '../model/LearningLanguagesModel.js';
import mongoose from "mongoose";
import ChapterModel from "../model/ChapterModel.js";
import LearningWordsModel from "../model/LearningWordsModel.js";
import MCQsModel from '../model/McqsModel.js';

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

    // 1. save language first
    const language = await LearningLanguagesModel.create({
      english,
      native,
      code,
      chapters: []
    });

    // 2. save chapters
    let chapterIds = [];

    if (chapters && chapters.length > 0) {

      for (let ch of chapters) {

        const newChapter = await ChapterModel.create({
          languageId: language._id,
          translations: ch.translations,
        });

        chapterIds.push(newChapter._id);
      }
    }

    // 3. update language with chapter ids

    language.chapters = chapterIds;
    await language.save();

    res.status(201).json({
      status: 1,
      message: "Language + chapters saved",
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

export const getAllLearningLanguages = async (req, res) => {
  try {

    const data = await LearningLanguagesModel
      .find()
      .populate("chapters")
      .sort({ createdAt: 1 });

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

    const data = await LearningLanguagesModel.findById(id).populate("chapters");

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

    const langId = req.params.id;

    const language = await LearningLanguagesModel.findById(langId);

    if (!language) {
      return res.status(404).json({
        status: 0,
        message: "Language not found",
      });
    }

    // delete chapters
    await ChapterModel.deleteMany({
      languageId: langId
    });

    // delete language
    await LearningLanguagesModel.findByIdAndDelete(langId);

    res.json({
      status: 1,
      message: "Language deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      status: 0,
      message: "Server error",
    });

  }
};

export const deleteLearningLangaugeChapterbyId = async (req, res) => {
  try {
    const { langId, chapterId } = req.params;

    const objectChapterId = new mongoose.Types.ObjectId(chapterId);

    const language = await LearningLanguagesModel.findById(langId);

    if (!language) {
      return res.status(404).json({
        status: 0,
        message: "Language not found",
      });
    }

    // Remove chapter reference
    language.chapters = language.chapters.filter(
      id => id.toString() !== chapterId
    );

    await language.save();

    // Delete chapter
    await ChapterModel.findByIdAndDelete(objectChapterId);

    // ✅ FIXED
    const lwResult = await LearningWordsModel.deleteMany({
      chapterId: objectChapterId
    });

    const mcqResult = await MCQsModel.deleteMany({
      chapterIds: objectChapterId
    });

    res.json({
      status: 1,
      message: "Chapter and related data deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      status: 0,
      message: error.message,
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

    const language =
      await LearningLanguagesModel.findById(id);

    if (!language) {
      return res.status(404).json({
        status: 0,
        message: "Language not found",
      });
    }

    // update basic fields
    language.english = english;
    language.native = native;
    language.code = code;

    // if chapters sent → recreate chapters
    if (chapters) {

      // delete old chapters
      await ChapterModel.deleteMany({
        languageId: id
      });

      let chapterIds = [];

      for (let ch of chapters) {

        const newChapter =
          await ChapterModel.create({
            languageId: id,
            translations: ch.translations
          });

        chapterIds.push(newChapter._id);
      }

      language.chapters = chapterIds;
    }

    await language.save();

    res.json({
      status: 1,
      message: "Language updated",
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

// get chapters
export const getAllChapters = async (req, res) => {
  try {

    const chapters = await ChapterModel
      .find()
      .select("_id translations") // ✅ only needed fields
      .sort({ createdAt: 1 });

    if (!chapters.length) {
      return res.status(404).json({
        status: 0,
        message: "No chapters found",
      });
    }

    res.json({
      status: 1,
      message: "Chapters fetched",
      data: chapters,
    });

  } catch (error) {

    console.log("getAllChapters error:", error);

    res.status(500).json({
      status: 0,
      message: "Server error",
    });

  }
};


export const createChapterForAllLanguages = async (req, res) => {

  try {

    const { translations } = req.body;

    const languages = await LearningLanguagesModel.find();

    let createdChapterId = null;

    for (let lang of languages) {

      const chapter = await ChapterModel.create({
        languageId: lang._id,
        translations
      });

      if (!createdChapterId) {
        createdChapterId = chapter._id;
      }

      lang.chapters.push(chapter._id);
      await lang.save();
    }

    res.json({
      status: 1,
      chapterId: createdChapterId
    });

  } catch (err) {

    res.json({
      status: 0,
      message: err.message
    });

  }

};