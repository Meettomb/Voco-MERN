import express from "express";
import authMiddleware from "../utils/authMiddlware.js";
import {
    markChapterComplete,
    getUserProgressByLanguage,
    getCompletedCertificates,
    getSingleCertificate
} from "../controller/UserProgressController.js";

const UserProgressRoutes = express.Router();

UserProgressRoutes.post("/mark-complete",authMiddleware,  markChapterComplete);
UserProgressRoutes.get(
  "/user-progress/:languageId",
  authMiddleware,
  getUserProgressByLanguage
);

UserProgressRoutes.get("/certificates", authMiddleware, getCompletedCertificates);
UserProgressRoutes.get("/certificate/:id", authMiddleware, getSingleCertificate);
export default UserProgressRoutes;