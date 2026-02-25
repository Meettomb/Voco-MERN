import express from "express";

import { registerUser, getUserData, getUserDataById, deleteUserById, addUiLaunguage, getUiLanguage, deleteUiLanguageById } from "../controller/UserTableController.js"

const route = express.Router()

route.post('/registerUser', registerUser)
route.get('/getUserData', getUserData)
route.get('/getUserDataById/:id', getUserDataById)
route.delete('/deleteUserById/:id', deleteUserById)

// UI Languages
route.post("/addUiLaunguage", addUiLaunguage)
route.get("/getUiLanguage", getUiLanguage)
route.delete("/deleteUiLanguage/:id", deleteUiLanguageById);
export default route