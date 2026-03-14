import express from "express";

import { registerUser, getUserData, getUserDataById, deleteUserById, updateUserRoleById, getActiveUsers } from "../controller/UserTableController.js"


const route = express.Router()

route.post('/registerUser', registerUser)
route.get('/getUserData', getUserData)
route.get('/getUserDataById/:id', getUserDataById)
route.put('/deleteUserById/:id', deleteUserById)
route.put('/updateUserRoleById/:id', updateUserRoleById)
route.get('/getActiveUsers', getActiveUsers)

export default route