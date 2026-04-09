import express from "express";
import {
    startExam,
    getExamQuestions,
    saveAnswer,
    submitExam,
    getFinalExamQuestions,
    submitFinalExam,
    saveFinalAnswer
} from "../controller/ExamAttemptController.js";
import authMiddleware from "../utils/authMiddlware.js";

const ExamAttemptRoutes = express.Router();

// include chapterId + auth
ExamAttemptRoutes.post("/startExam/:chapterId", authMiddleware, startExam);
ExamAttemptRoutes.get("/getExamQuestions/:chapterId", authMiddleware, getExamQuestions);
ExamAttemptRoutes.post("/saveAnswer/:chapterId", authMiddleware, saveAnswer);
ExamAttemptRoutes.post("/submitExam/:chapterId", authMiddleware, submitExam);
ExamAttemptRoutes.get("/getFinalExamQuestions/:code", authMiddleware, getFinalExamQuestions);
ExamAttemptRoutes.post("/final-exam/submit/:code", authMiddleware, submitFinalExam);
ExamAttemptRoutes.post(
  "/final-exam/save-answer/:code",
  authMiddleware,
  saveFinalAnswer
);

export default ExamAttemptRoutes;