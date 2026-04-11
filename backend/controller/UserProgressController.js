import mongoose from "mongoose";

import UserModel from "../model/UserModel.js";
import UserProgressModel from "../model/UserProgressModel.js";
import LearningLanguagesModel from "../model/LearningLanguagesModel.js";
import ChapterModel from "../model/ChapterModel.js";

export const markChapterComplete = async (req, res) => {
    try {
        const { userId, languageId, chapterId } = req.body;

        if (!userId || !languageId || !chapterId) {
            return res.status(400).json({
                status: 0,
                message: "Missing required fields",
            });
        }

        // 1. Find user progress
        let progress = await UserProgressModel.findOne({ userId });

        // 2. If not exists → create
        if (!progress) {
            progress = new UserProgressModel({
                userId,
                learningLanguages: [
                    {
                        languageId,
                        completedChapters: [chapterId],
                    },
                ],
            });

            await progress.save();

            return res.json({
                status: 1,
                message: "Chapter marked complete",
            });
        }

        // 3. Check if language exists
        const langIndex = progress.learningLanguages.findIndex(
            (l) => l.languageId.toString() === languageId
        );

        if (langIndex === -1) {
            // Add new language
            progress.learningLanguages.push({
                languageId,
                completedChapters: [chapterId],
            });
        } else {
            // Add chapter (avoid duplicate)
            const alreadyDone = progress.learningLanguages[
                langIndex
            ].completedChapters.includes(chapterId);

            if (!alreadyDone) {
                progress.learningLanguages[
                    langIndex
                ].completedChapters.push(chapterId);
            }
        }

        await progress.save();

        return res.json({
            status: 1,
            message: "Chapter marked complete",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 0,
            message: "Server error",
        });
    }
};

export const getUserProgressByLanguage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { languageId } = req.params;

    const progress = await UserProgressModel.findOne({ userId });

    if (!progress) {
      return res.json({
        status: 1,
        data: {
          completedChapters: []
        }
      });
    }

    const langProgress = progress.learningLanguages.find(
      (l) => l.languageId.toString() === languageId
    );

    return res.json({
      status: 1,
      data: {
        completedChapters: langProgress?.completedChapters || [],
        isCourseCompleted: langProgress?.isCourseCompleted || false
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 0,
      message: "Server error"
    });
  }
};