import express from "express";
import { getDashboardData } from "../controller/DashboardController.js";

const DashboardRoute = express.Router();

DashboardRoute.get("/data", getDashboardData);

export default DashboardRoute;