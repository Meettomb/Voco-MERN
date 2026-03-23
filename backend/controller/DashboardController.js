import mongoose from "mongoose";

import UserModel from "../model/UserModel.js";
import LearningLanguagesModel from "../model/LearningLanguagesModel.js";
import LearningWordsModel from "../model/LearningWordsModel.js";
import McqsModel from "../model/McqsModel.js";


export const getDashboardData = async (req, res) => {
  try {

    // ---------- SYSTEM STATUS ----------
    let dbStatus = "Disconnected";

    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        dbStatus = "Connected";
      }
    } catch {
      dbStatus = "Error";
    }


    // ---------- COUNTS ----------
    const totalUsers = await UserModel.countDocuments();

    const activeUsers = await UserModel.countDocuments({
      isActive: true
    });

    // ✅ blocked = not active
    const blockedUsers = await UserModel.countDocuments({
      isActive: false
    });


    const totalLanguages =
      await LearningLanguagesModel.countDocuments();

    const totalWords =
      await LearningWordsModel.countDocuments();

    const totalMcq =
      await McqsModel.countDocuments();


    // ---------- RECENT USERS ----------
    const recentUsers = await UserModel
      .find()
      .sort({ createdAt: -1 })
      .limit(4)
      .select("username");


    return res.json({
      status: 1,
      data: {

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

      }
    });

  } catch (error) {

    res.json({
      status: 0,
      message: error.message
    });

  }
};