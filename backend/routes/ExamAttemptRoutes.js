import express from "express";
import {
    startExam,
    getExamQuestions,
    saveAnswer,
    submitExam
} from "../controller/ExamAttemptController.js";
import authMiddleware from "../utils/authMiddlware.js";

const ExamAttemptRoutes = express.Router();

// include chapterId + auth
ExamAttemptRoutes.post("/startExam/:chapterId", authMiddleware, startExam);
ExamAttemptRoutes.get("/getExamQuestions/:chapterId", authMiddleware, getExamQuestions);
ExamAttemptRoutes.post("/saveAnswer/:chapterId", authMiddleware, saveAnswer);
ExamAttemptRoutes.post("/submitExam/:chapterId", authMiddleware, submitExam);

export default ExamAttemptRoutes;