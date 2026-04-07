import express from "express";
import authMiddleware from "../utils/authMiddlware.js";
import {
  registerUser,
  getUserData,
  getUserDataById,
  updateUserActiveStatus,
  updateUserRoleById,
  getActiveUsers,
  updateUserPersonalDetailById,
  updateUserPasswordById,
  searchUsers,
  Login,
  updateUserById,
  verifyPhoneOtp
} from "../controller/UserTableController.js";


import { sendOtp, verifyOtp } from "../controller/UserTableController.js";

const route = express.Router()

route.post('/registerUser', registerUser)
route.get('/getUserData', authMiddleware, getUserData)
route.get('/getUserDataById/:id', authMiddleware, getUserDataById)
route.patch('/updateUserActiveStatus/:id', authMiddleware, updateUserActiveStatus)
route.patch('/updateUserRoleById/:id', authMiddleware, updateUserRoleById)
route.patch("/updateUserPasswordById/:id", authMiddleware, updateUserPasswordById);
route.get('/getActiveUsers', authMiddleware, getActiveUsers)
route.get("/searchUsers", authMiddleware, searchUsers);
route.post("/Login",Login);
route.patch("/updateUserById/:id", authMiddleware, updateUserById);


// --------------------------------------------------
// Profile Settings - Personal Details
// -------------------------
route.patch('/updateUserPersonalDetailById/:id', authMiddleware, updateUserPersonalDetailById)
route.post("/verifyPhoneOtp",authMiddleware, verifyPhoneOtp);

// --------------------------------------------------
// OTP
// -------------------------

route.post("/sendOtp", sendOtp);
route.post("/verifyOtp", verifyOtp);

export default route