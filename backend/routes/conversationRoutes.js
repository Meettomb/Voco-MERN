
import express from "express";
import authMiddleware from "../utils/authMiddlware.js";

import {
  createConversation,
  saveConversationMessage,
  endConversation,
  getConversationReport,
  getConversationList,
  deleteConversation,
} from "../controller/conversationController.js";

const router = express.Router();

router.post("/", authMiddleware, createConversation);
router.get("/", authMiddleware, getConversationList);
router.delete("/:conversationId", authMiddleware, deleteConversation);

router.post(
  "/:conversationId/messages",
  authMiddleware,
  saveConversationMessage
);

router.post(
  "/:conversationId/end",
  authMiddleware,
  endConversation
);

router.get(
  "/:conversationId/report",
  authMiddleware,
  getConversationReport
);

export default router;
