import express from "express";
import { addLearningWord, deleteLearningWordById, getLearningWords, updateLearningWordById } from "../controller/LearningWordsController.js";
import { imageUpload } from "../middleware/imageUpload.js";

const LearningWordsRoutes = express.Router()

// Learning Words
LearningWordsRoutes.post("/addLearningWord",imageUpload.array("image"), addLearningWord)
LearningWordsRoutes.get("/getLearningWords", getLearningWords)
LearningWordsRoutes.delete("/deleteLearningWord/:id", deleteLearningWordById);
LearningWordsRoutes.put("/updateLearningWordById/:id",imageUpload.array("image"), updateLearningWordById);
export default LearningWordsRoutes;