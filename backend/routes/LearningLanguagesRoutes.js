import express from 'express';
import {
    addLearningLanguages,
    getAllLearningLanguages,
    getLearningLanguagesById,
    deleteLearningLangaugebyId,
    deleteLearningLangaugeChapterbyId,
    updateLearningLangauge,
    getAllChapters
} from "../controller/LearningLanguagesController.js";
import authMiddleware from "../utils/authMiddlware.js";

const LearningLanguagesRoutes = express.Router();
LearningLanguagesRoutes.post("/addLearningLanguages", authMiddleware, addLearningLanguages);
LearningLanguagesRoutes.get("/getAllLearningLanguages", authMiddleware, getAllLearningLanguages);
LearningLanguagesRoutes.get("/getLearningLanguagesById/:id", authMiddleware, getLearningLanguagesById);
LearningLanguagesRoutes.delete("/deleteLearningLangaugebyId/:id", authMiddleware, deleteLearningLangaugebyId);
LearningLanguagesRoutes.delete("/deleteLearningLangaugeChapterbyId/:langId/:chapterId", authMiddleware, deleteLearningLangaugeChapterbyId);
LearningLanguagesRoutes.put("/updateLearningLangauge/:id", authMiddleware, updateLearningLangauge);

// Chapters
LearningLanguagesRoutes.get("/getAllChapters", authMiddleware, getAllChapters);



export default LearningLanguagesRoutes;