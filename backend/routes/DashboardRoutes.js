import express from "express";
import { getDashboardData } from "../controller/DashboardController.js";
import authMiddleware from "../utils/authMiddlware.js";

const DashboardRoute = express.Router();

DashboardRoute.get("/data", authMiddleware, getDashboardData);

export default DashboardRoute;