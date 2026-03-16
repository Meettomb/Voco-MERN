import McqsModel from "../model/McqsModel.js";
import fs from "fs";
import path from "path";

export const addMcqs = async (req, res) => {
    try {

        const chapterId = req.body.chapterId;
        let mcqs = req.body.mcqs;

        // ---------- BASIC VALIDATION ----------

        if (!chapterId || !mcqs) {
            return res.status(400).json({
                status: 0,
                message: "chapterId and mcqs required",
            });
        }

        // ---------- SAFE JSON PARSE ----------

        try {
            mcqs = JSON.parse(mcqs);
        } catch (err) {
            return res.status(400).json({
                status: 0,
                message: "Invalid mcqs JSON format",
            });
        }
        if (!Array.isArray(mcqs)) {
            return res.status(400).json({
                status: 0,
                message: "mcqs must be array",
            });
        }
        if (!Array.isArray(mcqs) || mcqs.length === 0) {
            return res.status(400).json({
                status: 0,
                message: "mcqs must be array",
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

            const correctIndex = q.options.findIndex(
                (opt) => opt.en === q.correctAnswer.en
            );

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
            chapterId,
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

        const mcqs = await McqsModel.find().sort({ createdAt: -1 });

        if (!mcqs || mcqs.length === 0) {
            return res.status(404).json({
                status: 0,
                message: "No MCQs found",
                count: 0,
                data: [],
            });
        }

        return res.status(200).json({
            status: 1,
            message: "MCQs fetched successfully",
            count: mcqs.length,
            data: mcqs,
        });

    } catch (error) {

        console.error("getAllMcqs error:", error);

        return res.status(500).json({
            status: 0,
            message: "Failed to fetch MCQs",
        });

    }
};

export const getAllMcqsByDifficulty = async (req, res) => {
    try {

        const { difficultyLevel } = req.params;

        if (!difficultyLevel) {
            return res.status(400).json({
                status: 0,
                message: "difficultyLevel parameter is required",
            });
        }

        const mcqs = await McqsModel.find({
            difficultyLevel: {
                $regex: `^${difficultyLevel}$`,
                $options: "i",
            },
        }).sort({ createdAt: -1 });


        if (!mcqs || mcqs.length === 0) {
            return res.status(404).json({
                status: 0,
                message: `No MCQs found for difficulty '${difficultyLevel}'`,
                count: 0,
                data: [],
            });
        }

        return res.status(200).json({
            status: 1,
            message: "MCQs fetched successfully",
            count: mcqs.length,
            data: mcqs,
        });

    } catch (error) {

        console.error("getAllMcqsByDifficulty error:", error);

        return res.status(500).json({
            status: 0,
            message: "Failed to fetch MCQs",
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
    try {
      mcqs = JSON.parse(mcqs);
    } catch {
      return res.status(400).json({
        status: 0,
        message: "Invalid mcqs format",
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