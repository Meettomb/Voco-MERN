import express from 'express';
import {
    addLearningLanguages,
    getAllLearningLanguages,
    getLearningLanguagesById,
    deleteLearningLangaugebyId,
    deleteLearningLangaugeChapterbyId,
    updateLearningLangauge
} from "../controller/LearningLanguagesController.js"

const LearningLanguagesRoutes = express.Router();
LearningLanguagesRoutes.post("/addLearningLanguages", addLearningLanguages);
LearningLanguagesRoutes.get("/getAllLearningLanguages", getAllLearningLanguages);
LearningLanguagesRoutes.get("/getLearningLanguagesById/:id", getLearningLanguagesById);
LearningLanguagesRoutes.delete("/deleteLearningLangaugebyId/:id", deleteLearningLangaugebyId);
LearningLanguagesRoutes.delete("/deleteLearningLangaugeChapterbyId/:langId/:chapterId", deleteLearningLangaugeChapterbyId);
LearningLanguagesRoutes.put("/updateLearningLangauge/:id", updateLearningLangauge);


export default LearningLanguagesRoutes;