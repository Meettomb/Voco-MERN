import express from "express";

import { registerUser, getUserData, getUserDataById, deleteUserById, addUiLaunguage, getUiLanguage } from "../controller/UserTableController.js"

const route = express.Router()

route.post('/registerUser', registerUser)
route.get('/getUserData', getUserData)
route.get('/getUserDataById/:id', getUserDataById)
route.delete('/deleteUserById/:id', deleteUserById)
route.post("/addUiLaunguage", addUiLaunguage)
route.get("/getUiLanguage", getUiLanguage)
export default route