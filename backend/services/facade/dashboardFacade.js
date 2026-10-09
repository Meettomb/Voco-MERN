
import mongoose from "mongoose";

import UserModel from "../../model/UserModel.js";
import LearningLanguagesModel from "../../model/LearningLanguagesModel.js";
import LearningWordsModel from "../../model/LearningWordsModel.js";
import McqsModel from "../../model/McqsModel.js";

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

  // Return the combined dashboard data
  return {
    system: {
      server: "Online",
      database: dbStatus,
      api: "Running"
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
