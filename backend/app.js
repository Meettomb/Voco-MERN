import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/userModel",UserRoutes)

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.get("/", (req, res) => {
  res.send("Voco Backend Server Running");
});

export default app;
