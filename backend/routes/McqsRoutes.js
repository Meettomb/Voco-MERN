import express from "express";
import { imageUpload } from "../middleware/imageUpload.js";
import {
    addMcqs,
    deleteMcqsById,
    getAllMcqs,
    getAllMcqsByDifficulty,
    updateMcqsById
} from "../controller/McqsController.js";

const mcqRoute = express.Router();

mcqRoute.post("/addMcqs", imageUpload.array("image"), addMcqs);
mcqRoute.delete("/deleteMcqsById/:id", deleteMcqsById);
mcqRoute.get("/getAllMcqs", getAllMcqs);
mcqRoute.get("/getAllMcqsByDifficulty/:difficultyLevel", getAllMcqsByDifficulty);
mcqRoute.patch("/updateMcqsById/:id", imageUpload.array("image"), updateMcqsById);

export default mcqRoute;
