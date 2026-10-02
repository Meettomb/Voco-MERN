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


export const getCompletedCertificates = async (req, res) => {
    try {

        const userId = req.user.id;

        const progress =
            await UserProgressModel.findOne({ userId })
                .populate("learningLanguages.languageId");


        if (!progress) {

            return res.json({
                status: 1,
                data: []
            });
        }


        /*
         * Only include completed courses whose
         * language still exists in the database.
         */
        const completedCourses =
            progress.learningLanguages.filter(
                (lang) =>
                    lang.isCourseCompleted === true &&
                    lang.languageId !== null
            );


        /*
         * Format certificate response.
         */
        const result =
            completedCourses.map((lang) => ({
                languageId: lang.languageId._id,
                name: lang.languageId.english,
                native: lang.languageId.native,
                completedAt: lang.completedAt
            }));


        return res.json({
            status: 1,
            data: result
        });


    } catch (err) {

        console.error(err);

        return res.status(500).json({
            status: 0,
            message: "Server error"
        });
    }
};

export const getSingleCertificate = async (req, res) => {
  try {

    const userId = req.user.id;
    const { id } = req.params;


    // Fetch user + progress in parallel
    const [progress, user] = await Promise.all([
      UserProgressModel.findOne({ userId })
        .populate("learningLanguages.languageId"),

      UserModel.findById(userId)
    ]);


    if (!progress) {
      return res.status(404).json({
        status: 0,
        message: "Progress not found",
      });
    }


    // Find completed certificate
    const cert = progress.learningLanguages.find(
      (l) =>
        l.languageId &&
        l.languageId._id.toString() === id &&
        l.isCourseCompleted === true
    );


    if (!cert) {
      return res.status(404).json({
        status: 0,
        message: "Certificate not found",
      });
    }


    // Final response
    return res.json({
      status: 1,

      data: {
        userName: user.username,
        name: cert.languageId.english,
        completedAt: cert.completedAt,
        certificateId: `VOCO-${id.slice(-6)}`
      },
    });


  } catch (err) {

    console.error(err);

    return res.status(500).json({
      status: 0,
      message: "Server error",
    });
  }
};