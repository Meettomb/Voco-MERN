import express from "express";

import { registerUser, getUserData, getUserDataById, deleteUserById } from "../controller/UserTableController.js"

const route = express.Router()

route.post('/registerUser', registerUser)
route.get('/getUserData', getUserData)
route.get('/getUserDataById/:id', getUserDataById)
route.delete('/deleteUserById/:id', deleteUserById)

export default route