import express from "express";
import { getUniqueChapters } from "../controller/ChapterController.js";
import authMiddleware from "../utils/authMiddlware.js";

const ChapterRoutes = express.Router();

ChapterRoutes.get("/getUniqueChapters", authMiddleware, getUniqueChapters);

export default ChapterRoutes;