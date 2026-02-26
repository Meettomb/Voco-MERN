import express from "express";
import { addUiLaunguage, getUiLanguage, deleteUiLanguageById } from "../controller/UiLaunguageController.js";

const route = express.Router()

// UI Languages
route.post("/addUiLaunguage", addUiLaunguage)
route.get("/getUiLanguage", getUiLanguage)
route.delete("/deleteUiLanguage/:id", deleteUiLanguageById);