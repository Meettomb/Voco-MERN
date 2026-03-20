import express from "express";

import {
  registerUser,
  getUserData,
  getUserDataById,
  updateUserActiveStatus,
  updateUserRoleById,
  getActiveUsers,
  updateUserPersonalDetailById,
  updateUserPasswordById,
  searchUsers
} from "../controller/UserTableController.js";


import { sendOtp, verifyOtp } from "../controller/UserTableController.js";


const route = express.Router()

route.post('/registerUser', registerUser)
route.get('/getUserData', getUserData)
route.get('/getUserDataById/:id', getUserDataById)
route.patch('/updateUserActiveStatus/:id', updateUserActiveStatus)
route.patch('/updateUserRoleById/:id', updateUserRoleById)
route.patch("/updateUserPasswordById/:id", updateUserPasswordById);
route.get('/getActiveUsers', getActiveUsers)
route.get("/searchUsers",searchUsers);


// --------------------------------------------------
// Profile Settings - Personal Details
// -------------------------
route.put('/updateUserPersonalDetailById/:id', updateUserPersonalDetailById)


// --------------------------------------------------
// OTP
// -------------------------

route.post("/sendOtp", sendOtp);
route.post("/verifyOtp", verifyOtp);

export default route