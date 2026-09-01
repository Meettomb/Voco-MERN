import McqsModel from "../model/McqsModel.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

export const addMcqs = async (req, res) => {
  try {

    const chapterIds = req.body.chapterIds;
    const mcqs = req.body.mcqs;

    // ---------- BASIC VALIDATION ----------

    if (!chapterIds || !mcqs) {
      return res.status(400).json({
        status: 0,
        message: "chapterIds and mcqs required",
      });
    }

    if (!Array.isArray(chapterIds) || chapterIds.length === 0) {
      return res.status(400).json({
        status: 0,
        message: "chapterIds must be array",
      });
    }

    if (!Array.isArray(mcqs) || mcqs.length === 0) {
      return res.status(400).json({
        status: 0,
        message: "mcqs must be non-empty array",
      });
    }


    // ---------- DIFFICULTY CHECK ----------

    const difficultyLevel = mcqs[0].difficulty;

    if (!difficultyLevel) {
      return res.status(400).json({
        status: 0,
        message: "difficulty required",
      });
    }


    // ---------- BUILD QUESTIONS ----------

    let questions = [];

    for (let q of mcqs) {

      if (!q.question) {
        return res.status(400).json({
          status: 0,
          message: "question required",
        });
      }

      if (!q.options || q.options.length !== 4) {
        return res.status(400).json({
          status: 0,
          message: "4 options required",
        });
      }

      if (!q.correctAnswer) {
        return res.status(400).json({
          status: 0,
          message: "correctAnswer required",
        });
      }


      // ---------- FIND CORRECT INDEX (dynamic languages) ----------

      const langKeys = Object.keys(q.correctAnswer);

      let correctIndex = -1;

      for (let i = 0; i < q.options.length; i++) {

        let match = true;

        for (let lang of langKeys) {

          if (q.options[i][lang] !== q.correctAnswer[lang]) {
            match = false;
            break;
          }

        }

        if (match) {
          correctIndex = i;
          break;
        }

      }

      if (correctIndex === -1) {
        return res.status(400).json({
          status: 0,
          message: "correctAnswer not found in options",
        });
      }


      questions.push({
        question: q.question,
        options: q.options,
        correctAnswer: correctIndex,
      });

    }


    // ---------- IMAGE REPLACE ----------

    if (req.files && req.files.length > 0) {

      req.files.forEach((file) => {

        const fullURL =
          `${req.protocol}://${req.get("host")}/uploads/images/${file.filename}`;

        questions.forEach((q) => {

          // question images
          Object.keys(q.question).forEach((lang) => {

            q.question[lang] =
              q.question[lang].replace(
                new RegExp(`src="${file.originalname}"`, "g"),
                `src="${fullURL}"`
              );

          });


          // option images
          q.options.forEach((opt) => {

            Object.keys(opt).forEach((lang) => {

              opt[lang] =
                opt[lang].replace(
                  new RegExp(`src="${file.originalname}"`, "g"),
                  `src="${fullURL}"`
                );

            });

          });

        });

      });

    }


    // ---------- SAVE ----------

    const mcqsData = new McqsModel({
      chapterIds,
      difficultyLevel,
      questions,
    });

    await mcqsData.save();


    return res.status(201).json({
      status: 1,
      message: "MCQs added successfully",
      data: mcqsData,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: 0,
      message: "Server error",
    });

  }
};

export const deleteMcqsById = async (req, res) => {
  try {

    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "ID required",
      });
    }

    const mcqs = await McqsModel.findById(id);

    if (!mcqs) {
      return res.status(404).json({
        status: 0,
        message: "MCQs not found",
      });
    }

    const imageFolder = path.join(
      process.cwd(),
      "uploads",
      "images"
    );


    // ---------- LOOP QUESTIONS ----------
    mcqs.questions.forEach((q) => {

      // QUESTION TEXT
      Object.values(q.question || {}).forEach((text) => {

        text = String(text || "");

        const matches = text.match(/src="([^"]+)"/g);

        if (!matches) return;

        matches.forEach((m) => {

          const url = m.replace('src="', "").replace('"', "");

          const fileName = url.split("/").pop();

          const filePath = path.join(imageFolder, fileName);

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

        });

      });


      // OPTIONS
      q.options.forEach((opt) => {

        Object.values(opt || {}).forEach((text) => {

          text = String(text || "");

          const matches = text.match(/src="([^"]+)"/g);

          if (!matches) return;

          matches.forEach((m) => {

            const url = m.replace('src="', "").replace('"', "");

            const fileName = url.split("/").pop();

            const filePath = path.join(imageFolder, fileName);

            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }

          });

        });

      });

    });


    // ---------- DELETE DB ----------
    await McqsModel.findByIdAndDelete(id);


    return res.status(200).json({
      status: 1,
      message: "MCQs deleted successfully",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: 0,
      message: "Server error",
    });

  }
};

export const getAllMcqs = async (req, res) => {
  try {

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    const skip = (page - 1) * limit;

    // Get total number of MCQs
    const totalItems = await McqsModel.countDocuments();

    // Get MCQs for current page only
    const mcqs = await McqsModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("chapterIds");

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      status: 1,
      message: "MCQs fetched successfully",

      data: mcqs,

      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        limit: limit
      }
    });

  } catch (error) {

    console.error("getAllMcqs error:", error);

    return res.status(500).json({
      status: 0,
      message: "Failed to fetch MCQs"
    });

  }
};

export const getAllMcqsByDifficulty = async (req, res) => {
  try {
    const { difficultyLevel } = req.params;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    const skip = (page - 1) * limit;

    const filter = {
      difficultyLevel: {
        $regex: `^${difficultyLevel}$`,
        $options: "i"
      }
    };

    const total = await McqsModel.countDocuments(filter);

    const mcqs = await McqsModel.find(filter)
      .populate("chapterIds")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: 1,
      message: "MCQs fetched successfully",
      data: mcqs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit
      }
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: 0,
      message: "Error"
    });
  }
};

export const updateMcqsById = async (req, res) => {
  try {
    const id = req.params.id;

    let mcqs = req.body.mcqs;
    const chapterId = req.body.chapterId;

    if (!id) {
      return res.status(400).json({
        status: 0,
        message: "ID required",
      });
    }

    if (!mcqs) {
      return res.status(400).json({
        status: 0,
        message: "mcqs required",
      });
    }

    // ---------- PARSE JSON ----------
    // already object from frontend
    if (!Array.isArray(mcqs)) {
      return res.status(400).json({
        status: 0,
        message: "mcqs must be array",
      });
    }

    if (!Array.isArray(mcqs)) {
      return res.status(400).json({
        status: 0,
        message: "mcqs must be array",
      });
    }

    const oldData = await McqsModel.findById(id);

    if (!oldData) {
      return res.status(404).json({
        status: 0,
        message: "MCQs not found",
      });
    }

    const difficultyLevel = mcqs[0].difficulty;

    let questions = [];

    // ---------- BUILD QUESTIONS ----------
    for (let q of mcqs) {
      if (!q.question || typeof q.question !== "object") {
        return res.status(400).json({
          status: 0,
          message: "question must be object",
        });
      }

      if (!q.options || q.options.length !== 4) {
        return res.status(400).json({
          status: 0,
          message: "4 options required",
        });
      }

      if (!q.correctAnswer) {
        return res.status(400).json({
          status: 0,
          message: "correctAnswer required",
        });
      }

      const correctIndex = q.options.findIndex(
        (opt) => opt.en === q.correctAnswer.en
      );

      if (correctIndex === -1) {
        return res.status(400).json({
          status: 0,
          message: "correctAnswer not found in options",
        });
      }
      if (correctIndex === -1) {
        return res.status(400).json({
          status: 0,
          message: "correctAnswer not in options",
        });
      }

      questions.push({
        question: { ...q.question },
        options: q.options.map((o) => ({ ...o })),
        correctAnswer: correctIndex,
      });
    }

    // ---------- REPLACE NEW IMAGES ----------
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const fullURL =
          `${req.protocol}://${req.get("host")}/uploads/images/${file.filename}`;

        questions.forEach((q) => {
          Object.keys(q.question).forEach((lang) => {
            q.question[lang] = String(q.question[lang]).replace(
              new RegExp(`src="${file.originalname}"`, "g"),
              `src="${fullURL}"`
            );
          });

          q.options.forEach((opt) => {
            Object.keys(opt).forEach((lang) => {
              opt[lang] = String(opt[lang]).replace(
                new RegExp(`src="${file.originalname}"`, "g"),
                `src="${fullURL}"`
              );
            });
          });
        });
      });
    }

    const imageFolder = path.join(
      process.cwd(),
      "uploads",
      "images"
    );

    // ---------- GET OLD IMAGES ----------
    let oldImages = [];

    oldData.questions.forEach((q) => {
      Object.values(q.question || {}).forEach((text) => {
        const matches = String(text).match(/src="([^"]+)"/g);

        if (!matches) return;

        matches.forEach((m) => {
          const url = m.replace('src="', "").replace('"', "");

          if (!url.includes("/uploads/images/")) return;

          oldImages.push(url.split("/").pop());
        });
      });

      q.options.forEach((opt) => {
        Object.values(opt || {}).forEach((text) => {
          const matches = String(text).match(/src="([^"]+)"/g);

          if (!matches) return;

          matches.forEach((m) => {
            const url = m.replace('src="', "").replace('"', "");

            if (!url.includes("/uploads/images/")) return;

            oldImages.push(url.split("/").pop());
          });
        });
      });
    });

    // ---------- GET NEW IMAGES ----------
    let newImages = [];

    questions.forEach((q) => {
      Object.values(q.question || {}).forEach((text) => {
        const matches = String(text).match(/src="([^"]+)"/g);

        if (!matches) return;

        matches.forEach((m) => {
          const url = m.replace('src="', "").replace('"', "");

          if (!url.includes("/uploads/images/")) return;

          newImages.push(url.split("/").pop());
        });
      });

      q.options.forEach((opt) => {
        Object.values(opt || {}).forEach((text) => {
          const matches = String(text).match(/src="([^"]+)"/g);

          if (!matches) return;

          matches.forEach((m) => {
            const url = m.replace('src="', "").replace('"', "");

            if (!url.includes("/uploads/images/")) return;

            newImages.push(url.split("/").pop());
          });
        });
      });
    });

    // ---------- DELETE OLD IMAGES ----------
    oldImages.forEach((img) => {
      if (!newImages.includes(img)) {
        const filePath = path.join(imageFolder, img);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });

    // ---------- IMPORTANT FIX ----------
    // DO NOT use findByIdAndUpdate with Map + Array

    const doc = await McqsModel.findById(id);

    doc.chapterId = chapterId;
    doc.difficultyLevel = difficultyLevel;
    doc.questions = questions;

    await doc.save();

    return res.status(200).json({
      status: 1,
      message: "MCQs updated successfully",
      data: doc,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};


export const getMcqsById = async (req, res) => {
  try {

    const { id } = req.params;

    const mcq = await McqsModel.findById(id)
      .populate("chapterIds");

    if (!mcq) {
      return res.status(404).json({
        status: 0,
        message: "MCQ not found",
      });
    }

    return res.status(200).json({
      status: 1,
      data: mcq,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      status: 0,
      message: "Error",
    });

  }
};


export const searchMcqs = async (req, res) => {
  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({
        status: 0,
        message: "Search key required"
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    const skip = (page - 1) * limit;

    const regex = new RegExp(key, "i");

    const pipeline = [
      {
        $lookup: {
          from: "chapters",
          localField: "chapterIds",
          foreignField: "_id",
          as: "chapterData"
        }
      },
      {
        $match: {
          $or: [
            { difficultyLevel: { $regex: regex } },
            { "questions.question.en": { $regex: regex } },
            { "chapterData.translations.en": { $regex: regex } }
          ]
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ];

    // Get total count
    const countResult = await McqsModel.aggregate([
      ...pipeline,
      {
        $count: "total"
      }
    ]);

    const total = countResult[0]?.total || 0;

    // Get paginated data
    const mcqs = await McqsModel.aggregate([
      ...pipeline,
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    return res.status(200).json({
      status: 1,
      message: "MCQs fetched successfully",
      data: mcqs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit
      }
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: 0,
      message: "Server error"
    });
  }
};


export const getMcqByChapterId = async (req, res) => {
  try {
    const { chapterId } = req.params;

    //  Validate
    if (!mongoose.Types.ObjectId.isValid(chapterId)) {
      return res.status(400).json({
        status: 0,
        message: "Invalid chapterId",
      });
    }

    //  Convert
    const objectId = new mongoose.Types.ObjectId(chapterId);

    //  Query
    const mcqs = await McqsModel.aggregate([
      { $match: { chapterIds: objectId } },
      { $sample: { size: 5 } }
    ]);

    if (!mcqs || mcqs.length === 0) {
      return res.status(404).json({
        status: 0,
        message: "No MCQs found for this chapter",
      });
    }

    return res.status(200).json({
      status: 1,
      data: mcqs,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: 0,
      message: "Error",
    });
  }
};