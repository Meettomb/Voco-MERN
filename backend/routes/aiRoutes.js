import express from "express";
import multer from "multer";

import {
  chatWithAI,
  transcribeSpeech
} from "../controller/aiController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

router.post("/chat", chatWithAI);

router.post(
  "/transcribe",
  upload.single("audio"),
  transcribeSpeech
);

export default router;