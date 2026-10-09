
import mongoose from "mongoose";

import UserModel from "../../model/UserModel.js";
import LearningLanguagesModel from "../../model/LearningLanguagesModel.js";
import LearningWordsModel from "../../model/LearningWordsModel.js";
import McqsModel from "../../model/McqsModel.js";

import axios from "axios";

/**
 * Structural Design Pattern: Facade
 *
 * Provides one simplified interface for retrieving
 * dashboard data from multiple subsystems.
 */
export const getDashboardSummary = async () => {
    // System status
    let dbStatus = "Disconnected";

    try {
        if (mongoose.connection.db) {
            await mongoose.connection.db.admin().ping();
            dbStatus = "Connected";
        }
    } catch {
        dbStatus = "Error";
    }

    // Retrieve dashboard counts in parallel
    const [
        totalUsers,
        activeUsers,
        blockedUsers,
        totalLanguages,
        totalWords,
        totalMcq,
        recentUsers
    ] = await Promise.all([
        UserModel.countDocuments(),
        UserModel.countDocuments({ isActive: true }),
        UserModel.countDocuments({ isActive: false }),
        LearningLanguagesModel.countDocuments(),
        LearningWordsModel.countDocuments(),
        McqsModel.countDocuments(),
        UserModel.find()
            .sort({ createdAt: -1 })
            .limit(4)
            .select("username")
    ]);

    const [ollamaStatus, sttStatus, ttsStatus] = await Promise.all([
        checkOllamaStatus(),
        checkSTTStatus(),
        checkTTSStatus()
    ]);

    // Return the combined dashboard data

    // Return the combined dashboard data
    return {
        system: {
            server: "Online",
            database: dbStatus,
            api: "Running",
            aiServices: [
                {
                    name: "Ollama AI",
                    status: ollamaStatus
                },
                {
                    name: "Speech-to-Text",
                    status: sttStatus
                },
                {
                    name: "Text-to-Speech",
                    status: ttsStatus
                }
            ]
        },
        counts: {
            totalUsers,
            activeUsers,
            blockedUsers,
            totalLanguages,
            totalWords,
            totalMcq
        },
        recentUsers
    };

};



// Check the Ollama service
const checkOllamaStatus = async () => {
    try {
        const baseURL =
            process.env.OLLAMA_URL;

        const response = await axios.get(`${baseURL}/api/tags`, {
            timeout: 3000
        });

        return response.status === 200 ? "Running" : "Unavailable";
    } catch {
        return "Unavailable";
    }
};

// Check the Speech-to-Text service
const checkSTTStatus = async () => {
    try {
        const baseURL =
            process.env.STT_URL;

        // Replace /health with your actual STT health endpoint.
        const response = await axios.get(`${baseURL}/health`, {
            timeout: 3000
        });

        return response.status === 200 ? "Running" : "Unavailable";
    } catch {
        return "Unavailable";
    }
};

// TTS is currently configured only in the frontend
const checkTTSStatus = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8002/health",
      { timeout: 3000 }
    );

    return response.status === 200 ? "Running" : "Unavailable";
  } catch (error) {
    console.error("TTS health check failed:", error.message);
    return "Unavailable";
  }
};