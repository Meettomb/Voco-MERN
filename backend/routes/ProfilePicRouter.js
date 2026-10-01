import express from "express";
import authMiddleware from "../utils/authMiddlware.js";
import { uploadProfilePic } from "../controller/ProfilePicController.js";
import { imageUpload } from "../middleware/imageUpload.js";

const ProfilePicRoute = express.Router();

ProfilePicRoute.post("/uploadProfilePic", authMiddleware, imageUpload.single("image"), uploadProfilePic);
export default ProfilePicRoute;