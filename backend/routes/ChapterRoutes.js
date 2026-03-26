import express from "express";
import { getUniqueChapters } from "../controller/ChapterController.js";

const ChapterRoutes = express.Router();

ChapterRoutes.get("/getUniqueChapters", getUniqueChapters);

export default ChapterRoutes;