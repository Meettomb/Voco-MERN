import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js";
import UiLanguageRoutes from "./routes/UiLanguageRoutes.js";
import LearningWordsRoutes from "./routes/LearningWordsRoutes.js";
import mcqRoute from "./routes/McqsRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads")); 

app.use("/api/userModel",UserRoutes)
app.use("/api/UiLanguageModel", UiLanguageRoutes);
app.use("/api/LearningWordsModel", LearningWordsRoutes);
app.use("/api/McqsModel", mcqRoute);

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.get("/", (req, res) => {
  res.send("Voco Backend Server Running");
});

export default app;
