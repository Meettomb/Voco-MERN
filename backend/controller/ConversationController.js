
import mongoose from "mongoose";
import ConversationModel from "../model/ConversationModel.js";
import { analyzeConversationWithOllama } from "../services/ai/ollama.service.js";
import ConversationJob from "../model/ConversationJobModel.js";

// Create a new conversation

// Create a conversation when the learner sends their first input
export const createConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { language, content, inputMode, openingMessage } = req.body;

    if (!["en", "hi"].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "A valid learning language is required",
      });
    }

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "The learner's first message is required",
      });
    }

    if (!["speech", "text"].includes(inputMode)) {
      return res.status(400).json({
        success: false,
        message: "Input mode must be speech or text",
      });
    }

    const messages = [];

    // Preserve VOCO's opening message when provided
    if (
      typeof openingMessage === "string" &&
      openingMessage.trim()
    ) {
      messages.push({
        role: "assistant",
        content: openingMessage.trim(),
        timestamp: new Date(),
      });
    }

    // Save the first learner input
    messages.push({
      role: "user",
      content: content.trim(),
      inputMode,
      timestamp: new Date(),
    });

    const conversation = await ConversationModel.create({
      userId,
      language,
      messages,
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Conversation started successfully",
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
    const { role, content, inputMode } = req.body;

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
    if (
      role === "user" &&
      inputMode != null &&
      !["speech", "text"].includes(inputMode)
    ) {
      return res.status(400).json({
        success: false,
        message: "Input mode must be speech or text",
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
            ...(role === "user" && inputMode
              ? { inputMode }
              : {}),
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
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID.",
      });
    }

    // 1. Claim the conversation so it cannot be queued twice.
    const conversation = await ConversationModel.findOneAndUpdate(
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
      { new: true }
    );

    // 2. Handle an already-ended conversation.
    if (!conversation) {
      const existing = await ConversationModel.findOne({
        _id: conversationId,
        userId,
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found.",
        });
      }

      if (existing.status === "completed") {
        return res.status(200).json({
          success: true,
          status: "completed",
          message: "Report is already available.",
          performance: existing.performance,
        });
      }

      if (existing.status === "analyzing") {
        return res.status(202).json({
          success: true,
          status: "analyzing",
          message: "Your report is already being generated.",
        });
      }

      if (existing.status === "failed") {
        return res.status(409).json({
          success: false,
          status: "failed",
          message: "Report generation previously failed. Please retry.",
        });
      }
    }

    // 3. Ensure that at least one learner message exists.
    const learnerMessages = conversation.messages.filter(
      (message) =>
        message.role === "user" &&
        message.content?.trim()
    );

    if (learnerMessages.length === 0) {
      conversation.status = "completed";
      await conversation.save();

      return res.status(400).json({
        success: false,
        message: "No learner messages found. No report was generated.",
      });
    }

    // 4. Create a background job.
    await ConversationJob.create({
      conversationId: conversation._id,
      userId,
      status: "pending",
      nextAttemptAt: new Date(),
    });

    // 5. Return immediately. Ollama is not called here.
    return res.status(202).json({
      success: true,
      status: "analyzing",
      message:
        "Your conversation has ended. Your performance report is being generated. We will email you when it is ready.",
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("End conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to queue conversation report.",
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

export const getConversationReportStatus = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      userId,
    }).select("_id status performance");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      status: conversation.status,
      performance:
        conversation.status === "completed"
          ? conversation.performance
          : null,
    });
  } catch (error) {
    console.error("Report status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch report status.",
    });
  }
};



export const getConversationList = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 5;
    const skip = (page - 1) * limit;

    const match = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    const [result] = await ConversationModel.aggregate([
      { $match: match },
      {
        $facet: {
          conversations: [
            {
              $sort: {
                startedAt: -1,
                createdAt: -1,
                _id: -1,
              },
            },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                language: 1,
                status: 1,
                startedAt: 1,
                endedAt: 1,
                createdAt: 1,
                messageCount: {
                  $size: { $ifNull: ["$messages", []] },
                },
                "performance.overallScore": 1,
              },
            },
          ],
          totalCount: [{ $count: "total" }],
        },
      },
    ]);

    const total = result?.totalCount?.[0]?.total || 0;

    return res.status(200).json({
      success: true,
      data: result?.conversations || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get conversation list error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve conversation list",
    });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const deletedConversation = await ConversationModel.findOneAndDelete({
      _id: conversationId,
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!deletedConversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Delete conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete conversation",
    });
  }
};



// Retrieve a complete conversation by ID
export const getSingleConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    // Validate conversation ID
    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    // Retrieve the complete conversation for the logged-in user
    const conversation = await ConversationModel.findOne({
      _id: conversationId,
      userId,
    }).lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("Get single conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve conversation",
    });
  }
};
