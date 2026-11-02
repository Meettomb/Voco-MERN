import Conversation from "../model/ConversationModel.js";
import ConversationJob from "../model/ConversationJobModel.js";
import User from "../model/UserModel.js";

import { analyzeConversationWithOllama } from
  "../services/ai/ollama.service.js";

import {sendMail} from "../utils/mailService.js";

const POLL_INTERVAL = 5000;
const MAX_ATTEMPTS = 3;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function processJob(job) {
  try {
    console.log(
      `[Conversation Worker] Processing: ${job.conversationId}`
    );

    const conversation = await Conversation.findOne({
      _id: job.conversationId,
      userId: job.userId,
      status: "analyzing",
    });

    if (!conversation) {
      throw new Error("Conversation not found or is not analyzing.");
    }

    const messages = conversation.messages.map((message) => ({
      role: message.role,
      content: message.content,
      inputMode: message.inputMode,
    }));

    // This is your existing report-generation function.
    const performance = await analyzeConversationWithOllama(
      {
        language: conversation.language,
        messages
      }
    );

    // Save the completed report.
    conversation.performance = performance;
    conversation.status = "completed";

    await conversation.save();

    // Find the conversation owner.
    const user = await User.findById(job.userId);

    if (!user) {
      throw new Error("Conversation owner not found.");
    }

    // Send the report-ready email.
    const reportUrl =
      `${process.env.FRONTEND_URL}/SingleConversation/${conversation._id}`;

    await sendMail(
      user.email, // Confirm your actual UserModel email field.
      "Your VOCO Conversation Report Is Ready",
      "conversationReport",
      {
        reportUrl,
        language: conversation.language,
      }
    );

    // Mark the job completed.
    job.status = "completed";
    job.completedAt = new Date();
    job.lastError = null;

    await job.save();

    console.log(
      `[Conversation Worker] Completed: ${job.conversationId}`
    );
  } catch (error) {
    console.error(
      `[Conversation Worker] Job failed: ${job.conversationId}`,
      error
    );

    job.attempts += 1;
    job.lastError = error.message;

    if (job.attempts >= MAX_ATTEMPTS) {
      job.status = "failed";

      await Conversation.updateOne(
        { _id: job.conversationId, status: "analyzing" },
        { $set: { status: "failed" } }
      );
    } else {
      job.status = "pending";
      job.nextAttemptAt = new Date(
        Date.now() + job.attempts * 30000
      );
    }

    await job.save();
  }
}

async function runWorker() {
  console.log("[Conversation Worker] Started.");

  while (true) {
    try {
      // Atomically claim one eligible job.
      const job = await ConversationJob.findOneAndUpdate(
        {
          status: "pending",
          nextAttemptAt: { $lte: new Date() },
        },
        {
          $set: {
            status: "processing",
            startedAt: new Date(),
          },
        },
        {
          new: true,
          sort: { createdAt: 1 },
        }
      );

      if (!job) {
        await sleep(POLL_INTERVAL);
        continue;
      }

      await processJob(job);
    } catch (error) {
      console.error("[Conversation Worker] Loop error:", error);
      await sleep(POLL_INTERVAL);
    }
  }
}

export default runWorker;