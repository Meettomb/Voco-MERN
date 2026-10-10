import express from "express";
import { addLearningWord, 
    deleteLearningWordById, 
    getLearningWords, 
    updateLearningWordById, 
    deleteLearningWordsByChapterId,
    getLearningWordById,
    getChaptersByLanguage
 } from "../controller/LearningWordsController.js";
import { imageUpload } from "../middleware/imageUpload.js";
import fs from "fs";
import path from "path";
import authMiddleware from "../utils/authMiddlware.js";
const LearningWordsRoutes = express.Router()

// Learning Words
LearningWordsRoutes.post(
    "/addLearningWord",
    authMiddleware,
    imageUpload.any(),
    addLearningWord
);

LearningWordsRoutes.get("/getLearningWords/:id", authMiddleware, getLearningWordById);
LearningWordsRoutes.get("/getLearningWords", authMiddleware, getLearningWords);
LearningWordsRoutes.delete("/deleteLearningWord/:id", authMiddleware, deleteLearningWordById);
LearningWordsRoutes.put(
    "/updateLearningWordById/:id",
    authMiddleware,
    imageUpload.any(),
    updateLearningWordById
);


LearningWordsRoutes.post(
    "/uploadImage",
    imageUpload.single("image"),
    (req, res) => {

        const url =
            `${req.protocol}://${req.get("host")}/uploads/images/${req.file.filename}`;

        res.json({
            status: 1,
            url
        });

    }
);

LearningWordsRoutes.delete("/deleteImage", (req, res) => {

    const { url } = req.body;

    if (!url) {
        return res.json({
            status: 0,
            message: "No url"
        });
    }

    const filePath = url.replace(
        `${req.protocol}://${req.get("host")}/`,
        ""
    );

    const fullPath = path.join(
        process.cwd(),
        filePath
    );

    if (fs.existsSync(fullPath)) {

        fs.unlinkSync(fullPath);

        return res.json({
            status: 1,
            message: "Image deleted"
        });

    }

    res.json({
        status: 0,
        message: "File not found"
    });

});


LearningWordsRoutes.delete(
  "/deleteLearningWordsByChapterId/:chapterId",
  authMiddleware,
  deleteLearningWordsByChapterId
);

LearningWordsRoutes.get(
    "/getChaptersByLanguage/:languageId",
    authMiddleware,
    getChaptersByLanguage
);
export default LearningWordsRoutes;