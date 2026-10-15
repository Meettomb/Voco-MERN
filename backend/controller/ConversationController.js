
import mongoose from "mongoose";
import ConversationModel from "../model/ConversationModel.js";
import { analyzeConversationWithOllama } from "../services/ai/ollama.service.js";

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { language } = req.body;

    if (!["en", "hi"].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "A valid learning language is required",
      });
    }

    const conversation = await ConversationModel.create({
      userId,
      language,
      messages: [],
      status: "active",
    });

    return res.status(201).json({
      success: true,
      conversationId: conversation._id,
      data: conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create conversation",
    });
  }
};

// Save a user or AI message
export const saveConversationMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { role, content } = req.body;

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    if (!["user", "assistant"].includes(role) ||
        typeof content !== "string" ||
        !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid role and message content are required",
      });
    }

    const conversation = await ConversationModel.findOneAndUpdate(
      {
        _id: conversationId,
        userId,
        status: "active",
      },
      {
        $push: {
          messages: {
            role,
            content: content.trim(),
            timestamp: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Active conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message saved",
    });
  } catch (error) {
    console.error("Save conversation message error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to save conversation message",
    });
  }
};

// End the conversation and generate its performance report
export const endConversation = async (req, res) => {
  let conversation;

  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    // Claim this active conversation so it cannot be analyzed twice.
    conversation = await ConversationModel.findOneAndUpdate(
      {
        _id: conversationId,
        userId,
        status: "active",
      },
      {
        $set: {
          status: "analyzing",
          endedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!conversation) {
      const existing = await ConversationModel.findOne({
        _id: conversationId,
        userId,
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      if (existing.status === "completed") {
        return res.status(200).json({
          success: true,
          data: {
            conversationId: existing._id,
            performance: existing.performance,
          },
        });
      }

      return res.status(409).json({
        success: false,
        message: "This conversation is already being analyzed",
      });
    }

    const userMessages = conversation.messages.filter(
      (message) => message.role === "user"
    );

    if (userMessages.length === 0) {
      await ConversationModel.updateOne(
        { _id: conversation._id, userId, status: "analyzing" },
        { $set: { status: "completed" } }
      );

      return res.status(400).json({
        success: false,
        message: "There are no learner messages to analyze",
      });
    }

    const performance = await analyzeConversationWithOllama({
      language: conversation.language,
      messages: conversation.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    const completed = await ConversationModel.findOneAndUpdate(
      {
        _id: conversation._id,
        userId,
        status: "analyzing",
      },
      {
        $set: {
          status: "completed",
          performance,
        },
      },
      { returnDocument: "after" }
    );

    return res.status(200).json({
      success: true,
      message: "Conversation analyzed successfully",
      data: {
        conversationId: completed._id,
        performance: completed.performance,
      },
    });
  } catch (error) {
    console.error("End conversation error:", error);

    // Allow a retry if analysis fails.
    if (conversation?._id) {
      await ConversationModel.updateOne(
        {
          _id: conversation._id,
          userId: req.user.id,
          status: "analyzing",
        },
        {
          $set: { status: "active", endedAt: null },
        }
      ).catch((resetError) => {
        console.error("Failed to reset conversation:", resetError);
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to analyze conversation",
    });
  }
};

// Retrieve a saved performance report
export const getConversationReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      userId,
      status: "completed",
    }).select("language startedAt endedAt performance");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Completed conversation report not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Get conversation report error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve conversation report",
    });
  }
};
