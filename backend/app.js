import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";
import UiLanguageRoutes from "./routes/UiLanguageRoutes.js";
import LearningWordsRoutes from "./routes/LearningWordsRoutes.js";
import mcqRoute from "./routes/McqsRoutes.js";
import ForgotPasswordRoutes from "./routes/ForgotPasswordRoutes.js";
import LearningLanguagesRoutes from "./routes/LearningLanguagesRoutes.js";
import DashboardRoutes from "./routes/DashboardRoutes.js";
import ChapterRoutes from "./routes/ChapterRoutes.js";
import ExamAttemptRoutes from "./routes/ExamAttemptRoutes.js";

const app = express();

app.use(cors({
  origin:"http://localhost:3000"
}));

app.use(express.json());

app.use("/uploads", express.static("uploads")); 

app.use("/api/userModel",UserRoutes)
app.use("/api/UiLanguageModel", UiLanguageRoutes);
app.use("/api/LearningWordsModel", LearningWordsRoutes);
app.use("/api/McqsModel", mcqRoute);
app.use("/api/ForgotPassword", ForgotPasswordRoutes);
app.use("/api/LearningLanguagesModel", LearningLanguagesRoutes);
app.use("/api/dashboard", DashboardRoutes);
app.use("/api/ChapterModel", ChapterRoutes);
app.use("/api/ExamAttemptModel", ExamAttemptRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.get("/", (req, res) => {
  res.send("Voco Backend Server Running");
});

app.use("/images", express.static("public"));
export default app;
