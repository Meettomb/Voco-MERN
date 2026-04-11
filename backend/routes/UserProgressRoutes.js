import express from "express";
import authMiddleware from "../utils/authMiddlware.js";
import {
    markChapterComplete,
    getUserProgressByLanguage
} from "../controller/UserProgressController.js";

const UserProgressRoutes = express.Router();

UserProgressRoutes.post("/mark-complete",authMiddleware,  markChapterComplete);
UserProgressRoutes.get(
  "/user-progress/:languageId",
  authMiddleware,
  getUserProgressByLanguage
);

export default UserProgressRoutes;