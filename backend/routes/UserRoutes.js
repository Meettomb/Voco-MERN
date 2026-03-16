import express from "express";

import {
  registerUser,
  getUserData,
  getUserDataById,
  deleteUserById,
  updateUserRoleById,
  getActiveUsers,
  updateUserPersonalDetailById,
  updateUserPasswordById,
} from "../controller/UserTableController.js";


const route = express.Router()

route.post('/registerUser', registerUser)
route.get('/getUserData', getUserData)
route.get('/getUserDataById/:id', getUserDataById)
route.put('/deleteUserById/:id', deleteUserById)
route.put('/updateUserRoleById/:id', updateUserRoleById)
route.patch("/updateUserPasswordById", updateUserPasswordById);
route.get('/getActiveUsers', getActiveUsers)


// --------------------------------------------------
// Profile Settings - Personal Details
// -------------------------
route.put('/updateUserPersonalDetailById/:id', updateUserPersonalDetailById)



export default route