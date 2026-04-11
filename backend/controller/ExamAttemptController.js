import mongoose from "mongoose";
import ExamAttempt from "../model/ExamAttemptModel.js";
import McqsModel from "../model/McqsModel.js";
import LearningLanguagesModel from "../model/LearningLanguagesModel.js"
import UserProgressModel from "../model/UserProgressModel.js"

export const startExam = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(chapterId)) {
            return res.status(400).json({
                status: 0,
                message: "Invalid chapterId",
            });
        }
        // 1. Check existing active attempt
        const existing = await ExamAttempt.findOne({
            userId,
            chapterId: new mongoose.Types.ObjectId(chapterId),
            isCompleted: false,
        });

        if (existing) {
            // ALSO check if expired
            if (new Date() > existing.endTime) {
                existing.isCompleted = true;
                await existing.save();
            } else {
                return res.status(200).json({
                    status: 1,
                    data: existing,
                    message: "Existing attempt found",
                });
            }
        }

        // 2. Get random MCQs
        const mcqs = await McqsModel.aggregate([
            { $match: { chapterIds: new mongoose.Types.ObjectId(chapterId) } },
            { $sample: { size: 5 } },
            { $project: { _id: 1 } },
        ]);

        if (!mcqs || mcqs.length === 0) {
            return res.status(404).json({
                status: 0,
                message: "No MCQs found",
            });
        }


        const mcqIds = mcqs.map(q => q._id);

        // 3. Create attempt
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 10 * 60 * 1000);

        const attempt = await ExamAttempt.create({
            userId,
            chapterId: new mongoose.Types.ObjectId(chapterId),
            examType: "chapter",
            mcqIds,
            startTime,
            endTime,
        });

        return res.status(200).json({
            status: 1,
            data: attempt,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: "Error" });
    }
};


export const getExamQuestions = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(chapterId)) {
            return res.status(400).json({
                status: 0,
                message: "Invalid chapterId",
            });
        }
        const attempt = await ExamAttempt.findOne({
            userId,
            chapterId: new mongoose.Types.ObjectId(chapterId),
            isCompleted: false,
        }).populate("mcqIds");

        if (!attempt) {
            return res.status(404).json({
                status: 0,
                message: "No active attempt",
            });
        }

        if (new Date() > attempt.endTime) {
            attempt.isCompleted = true;
            await attempt.save();

            return res.status(400).json({
                status: 0,
                message: "Exam time expired",
            });
        }

        return res.status(200).json({
            status: 1,
            data: {
                mcqs: attempt.mcqIds,
                endTime: attempt.endTime,
                answers: attempt.answers
            },
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: "Error" });
    }
};


export const saveAnswer = async (req, res) => {
    try {
        const { mcqId, questionIndex, selectedOption } = req.body;
        const userId = req.user.id;
        const { chapterId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(chapterId)) {
            return res.status(400).json({
                status: 0,
                message: "Invalid chapterId",
            });
        }

        const attempt = await ExamAttempt.findOne({
            userId,
            chapterId: new mongoose.Types.ObjectId(chapterId),
            isCompleted: false,
        });

        if (!attempt) {
            return res.status(404).json({ status: 0, message: "No attempt" });
        }

        if (new Date() > attempt.endTime) {
            return res.status(400).json({
                status: 0,
                message: "Time over, cannot save answer",
            });
        }
        // update or insert

        const existing = attempt.answers.find(
            a =>
                a.mcqId.toString() === mcqId &&
                a.questionIndex === questionIndex
        );

        if (existing) {
            existing.selectedOption = selectedOption;
        } else {
            attempt.answers.push({ mcqId, questionIndex, selectedOption });
        }

        await attempt.save();

        res.json({ status: 1, message: "Saved" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0 });
    }
};


export const submitExam = async (req, res) => {
    try {
        const userId = req.user.id;
        const { chapterId } = req.params;

        //  Validate
        if (!mongoose.Types.ObjectId.isValid(chapterId)) {
            return res.status(400).json({
                status: 0,
                message: "Invalid chapterId",
            });
        }

        //  Find attempt
        const attempt = await ExamAttempt.findOne({
            userId,
            chapterId: new mongoose.Types.ObjectId(chapterId),
            isCompleted: false,
        }).populate("mcqIds");

        if (!attempt) {
            return res.status(404).json({
                status: 0,
                message: "No active attempt found",
            });
        }

        //  Calculate score
        let score = 0;
        let total = 0;

        attempt.answers.forEach(ans => {
            const mcq = attempt.mcqIds.find(
                m => m._id.toString() === ans.mcqId.toString()
            );

            if (!mcq) return;

            const question = mcq.questions?.[ans.questionIndex];

            if (!question) return;

            total++;

            if (question.correctAnswer === ans.selectedOption) {
                score++;
            }
        });

        //  Calculate total questions
        // const total = attempt.mcqIds.reduce(
        //     (sum, mcq) => sum + (mcq.questions?.length || 0),
        //     0
        // );

        //  calculate percentage
        const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : 0;

        //  pass/fail logic
        const isPassed = percentage >= 70;

        //  DELETE attempt AFTER result calculation
        await ExamAttempt.deleteOne({ _id: attempt._id });

        //  Response
        return res.status(200).json({
            status: 1,
            score,
            total,
            percentage,
            isPassed,
        });

    } catch (err) {
        console.log("Submit Exam Error:", err);

        return res.status(500).json({
            status: 0,
            message: "Internal Server Error",
        });
    }
};

// ========================================================================================
// ========================================================================================
// ========================================================================================
// ================================== Final Exam ==========================================
// ========================================================================================
// ========================================================================================
// ========================================================================================

export const getFinalExamQuestions = async (req, res) => {
    try {
        const { code } = req.params;
        const userId = req.user.id;

        // Find language by code
        const language = await LearningLanguagesModel.findOne({ code });

        if (!language) {
            return res.status(404).json({
                status: 0,
                message: "Language not found",
            });
        }

        let attempt = await ExamAttempt.findOne({
            userId,
            langId: language._id,
            examType: "final", // IMPORTANT (if you added it)
            isCompleted: false,
        }).populate("mcqIds");

        if (!attempt) {
            const chapterIds = language.chapters;

            // 2. Fetch MCQs that belong to those chapters
            const mcqs = await McqsModel.find({
                chapterIds: { $in: chapterIds }
            });

            if (!mcqs.length) {
                return res.status(404).json({
                    status: 0,
                    message: "No MCQs found for this language",
                });
            }

            // Shuffle + limit
            const shuffled = mcqs.sort(() => 0.5 - Math.random());
            let selectedMcqs = [];
            let questionCount = 0;

            for (let mcq of shuffled) {
                selectedMcqs.push(mcq);
                questionCount += mcq.questions?.length || 0;

                if (questionCount >= 15) break;
            }

            const startTime = new Date();
            const endTime = new Date(startTime.getTime() + 15 * 60 * 1000);

            attempt = await ExamAttempt.create({
                userId,
                langId: language._id,
                examType: "final",
                mcqIds: selectedMcqs.map(q => q._id),
                answers: [],
                startTime,
                endTime,
                isCompleted: false
            });
        }

        // Time check
        if (new Date() > attempt.endTime) {

            // Calculate score
            let score = 0;
            let total = 0;

            attempt.mcqIds.forEach((mcq) => {
                mcq.questions?.forEach((question, index) => {

                    total++;

                    const userAnswer = answers.find(a =>
                        a.mcqId?.toString() === mcq._id.toString() &&
                        a.questionIndex === index
                    );

                    if (
                        userAnswer &&
                        Number(userAnswer.selectedOption) === Number(question.correctAnswer)
                    ) {
                        score++;
                    }
                });
            });

            const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : 0;
            const isPassed = percentage >= 70;

            // DELETE attempt
            await ExamAttempt.deleteOne({ _id: attempt._id });

            return res.status(200).json({
                status: 1,
                score,
                total,
                percentage,
                isPassed,
                message: "Time expired - auto submitted"
            });
        }

        return res.status(200).json({
            status: 1,
            data: {
                mcqs: attempt.mcqIds,
                endTime: attempt.endTime,
                answers: attempt.answers,
            },
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: "Error" });
    }
};

export const submitFinalExam = async (req, res) => {
    try {
        const { code } = req.params;
        const userId = req.user.id;

        const language = await LearningLanguagesModel.findOne({ code });

        if (!language) {
            return res.status(404).json({
                status: 0,
                message: "Language not found",
            });
        }

        const attempt = await ExamAttempt.findOne({
            userId,
            langId: language._id,
            examType: "final",
            isCompleted: false,
        }).populate("mcqIds");

        if (!attempt) {
            return res.status(404).json({
                status: 0,
                message: "No active attempt",
            });
        }

        let score = 0;
        let total = 0;

        attempt.mcqIds.forEach((mcq) => {
            mcq.questions?.forEach((question, index) => {

                total++;

                const userAnswer = attempt.answers.find(a =>
                    a.mcqId?.toString() === mcq._id.toString() &&
                    a.questionIndex === index
                );


                if (
                    userAnswer &&
                    Number(userAnswer.selectedOption) === Number(question.correctAnswer)
                ) {
                    score++;
                }
            });
        });


        await ExamAttempt.deleteOne({ _id: attempt._id });

        const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : 0;
        const isPassed = percentage >= 70;

        if (isPassed) {
            const progress = await UserProgressModel.findOne({ userId });

            if (progress) {
                const langIndex = progress.learningLanguages.findIndex(
                    (l) => l.languageId.toString() === language._id.toString()
                );

                if (langIndex !== -1) {

                    // Prevent overwrite
                    if (!progress.learningLanguages[langIndex].isCourseCompleted) {
                        progress.learningLanguages[langIndex].isCourseCompleted = true;
                    }

                    // Save completion time
                    progress.learningLanguages[langIndex].completedAt = new Date();

                    await progress.save();
                }
            }
        }

        return res.status(200).json({
            status: 1,
            score,
            total,
            percentage,
            isPassed,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, message: "Error" });
    }
};

export const saveFinalAnswer = async (req, res) => {
    try {
        const { code } = req.params;
        const { mcqId, questionIndex, selectedOption } = req.body;
        const userId = req.user.id;


        const language = await LearningLanguagesModel.findOne({ code });

        if (!language) {
            return res.status(404).json({ status: 0, message: "Language not found" });
        }

        const attempt = await ExamAttempt.findOne({
            userId,
            langId: language._id,
            examType: "final",
            isCompleted: false,
        });

        if (!attempt) {
            return res.status(404).json({ status: 0, message: "No attempt" });
        }

        if (new Date() > attempt.endTime) {
            return res.status(400).json({
                status: 0,
                message: "Time over",
            });
        }

        const existing = attempt.answers.find(
            a =>
                a.mcqId?.toString() === mcqId &&
                a.questionIndex === questionIndex
        );

        if (existing) {
            existing.selectedOption = selectedOption;
        } else {
            attempt.answers.push({
                mcqId,
                questionIndex,
                selectedOption
            });
        }

        await attempt.save();

        res.json({ status: 1, message: "Saved" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0 });
    }
};