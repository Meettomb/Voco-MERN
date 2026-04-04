import express from "express";
import { imageUpload } from "../middleware/imageUpload.js";
import {
    addMcqs,
    deleteMcqsById,
    getAllMcqs,
    getAllMcqsByDifficulty,
    updateMcqsById,
    getMcqsById,
    searchMcqs,
    getMcqByChapterId
} from "../controller/McqsController.js";
import authMiddleware from "../utils/authMiddlware.js";

const mcqRoute = express.Router();

mcqRoute.post("/addMcqs", authMiddleware, imageUpload.array("image"), addMcqs);
mcqRoute.delete("/deleteMcqsById/:id", authMiddleware, deleteMcqsById);
mcqRoute.get("/getAllMcqs", authMiddleware, getAllMcqs);
mcqRoute.get("/getAllMcqsByDifficulty/:difficultyLevel", authMiddleware, getAllMcqsByDifficulty);
mcqRoute.patch("/updateMcqsById/:id", authMiddleware, imageUpload.array("image"), updateMcqsById);
mcqRoute.get("/getMcqsById/:id", authMiddleware, getMcqsById);
mcqRoute.get("/searchMcqs", authMiddleware, searchMcqs);
mcqRoute.get("/getMcqByChapterId/:chapterId", authMiddleware, getMcqByChapterId);

export default mcqRoute;
