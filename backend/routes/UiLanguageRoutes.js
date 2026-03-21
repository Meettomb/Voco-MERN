import express from "express";
import { addUiLaunguage, getUiLanguage, deleteUiLanguageById, updateUiLanguageById, filterUiLanguages } from "../controller/UiLaunguageController.js";

const UiLanguageRoutes = express.Router()

// UI Languages
UiLanguageRoutes.post("/addUiLaunguage", addUiLaunguage)
UiLanguageRoutes.get("/getUiLanguage", getUiLanguage)
UiLanguageRoutes.delete("/deleteUiLanguage/:id", deleteUiLanguageById);
UiLanguageRoutes.put("/updateUiLanguageById/:id", updateUiLanguageById);
UiLanguageRoutes.get("/filterUiLanguages", filterUiLanguages);

export default UiLanguageRoutes;