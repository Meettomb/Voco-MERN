import express from "express";
import authMiddleware from "../utils/authMiddlware.js";
import { uploadProfilePic, getProfilePics, deleteProfilePic } from "../controller/ProfilePicController.js";
import { imageUpload } from "../middleware/imageUpload.js";

const ProfilePicRoute = express.Router();

ProfilePicRoute.post("/uploadProfilePic", authMiddleware, imageUpload.single("image"), uploadProfilePic);
ProfilePicRoute.get("/getProfilePics", authMiddleware, getProfilePics);
ProfilePicRoute.delete(
    "/deleteProfilePic/:id",
    authMiddleware,
    deleteProfilePic
);

export default ProfilePicRoute;