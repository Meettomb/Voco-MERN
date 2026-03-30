import express from "express";
import { addUiLaunguage, getUiLanguage, deleteUiLanguageById, updateUiLanguageById, filterUiLanguages } from "../controller/UiLaunguageController.js";
import authMiddleware from "../utils/authMiddlware.js";

const UiLanguageRoutes = express.Router()

// UI Languages
UiLanguageRoutes.post("/addUiLaunguage", authMiddleware, addUiLaunguage)
UiLanguageRoutes.get("/getUiLanguage", authMiddleware, getUiLanguage)
UiLanguageRoutes.delete("/deleteUiLanguage/:id", authMiddleware, deleteUiLanguageById);
UiLanguageRoutes.put("/updateUiLanguageById/:id", authMiddleware, updateUiLanguageById);
UiLanguageRoutes.get("/filterUiLanguages", authMiddleware, filterUiLanguages);

export default UiLanguageRoutes;