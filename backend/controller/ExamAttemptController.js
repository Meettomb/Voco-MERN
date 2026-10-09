import mongoose from "mongoose";
import ExamAttempt from "../model/ExamAttemptModel.js";
import McqsModel from "../model/McqsModel.js";
import LearningLanguagesModel from "../model/LearningLanguagesModel.js";
import UserProgressModel from "../model/UserProgressModel.js";
import UserModel from "../model/UserModel.js";
import { sendMail } from "../utils/mailService.js";
import { createExamAttempt } from "../services/factories/ExamAttemptFactory.js";


/*
 * ============================================================
 * CHAPTER EXAM
 * ============================================================
 */


/*
 * ============================================================
 * START EXAM
 * ============================================================
 *
 * Existing endpoint.
 *
 * This logic is kept unchanged so existing frontend/API
 * functionality continues to work.
 */
export const startExam = async (req, res) => {

    try {

        const { chapterId } = req.params;
        const { retry } = req.body;
        const userId = req.user.id;


        if (!mongoose.Types.ObjectId.isValid(chapterId)) {

            return res.status(400).json({
                status: 0,
                message: "Invalid chapterId",
            });
        }


        /*
         * 1. Check existing active attempt
         */
        let existing = await ExamAttempt.findOne({
            userId,
            chapterId: new mongoose.Types.ObjectId(chapterId),
            isCompleted: false,
        });


        if (existing) {

            /*
             * RETRY:
             * Delete the old active attempt so a completely
             * new attempt with new MCQs and new 10-minute timer
             * can be created below.
             */
            if (retry) {

                await ExamAttempt.deleteOne({
                    _id: existing._id
                });

                existing = null;

            } else {

                /*
                 * Check whether the existing attempt has expired.
                 */
                if (new Date() > existing.endTime) {

                    existing.isCompleted = true;

                    await existing.save();

                    existing = null;

                } else {

                    return res.status(200).json({
                        status: 1,
                        data: existing,
                        message: "Existing attempt found",
                    });
                }
            }
        }


        /*
         * 2. Get random MCQs
         */
        const mcqs = await McqsModel.aggregate([

            {
                $match: {
                    chapterIds:
                        new mongoose.Types.ObjectId(chapterId)
                }
            },

            {
                $sample: {
                    size: 5
                }
            },

            {
                $project: {
                    _id: 1
                }
            },

        ]);


        if (!mcqs || mcqs.length === 0) {

            return res.status(404).json({
                status: 0,
                message: "No MCQs found",
            });
        }


        const mcqIds = mcqs.map(q => q._id);


        /*
         * 3. Create attempt
         */
        const startTime = new Date();

        const endTime = new Date(
            startTime.getTime() +
            10 * 60 * 1000
        );


        const attempt = await createExamAttempt("chapter", {
            userId,
            chapterId: new mongoose.Types.ObjectId(chapterId),
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

        res.status(500).json({
            status: 0,
            message: "Error"
        });
    }
};


/*
 * ============================================================
 * START AND GET EXAM QUESTIONS
 * ============================================================
 *
 * Performance optimization:
 *
 * Previously the frontend needed:
 *
 *     POST startExam
 *             ↓
 *     GET getExamQuestions
 *
 * This endpoint performs both operations in one request.
 *
 * Existing exam logic is preserved:
 *
 * - Existing active attempt is reused.
 * - Expired attempt is completed.
 * - New attempt receives 5 random MCQs.
 * - Exam duration remains 10 minutes.
 * - MCQs are populated before returning.
 * - Saved answers are returned.
 * - Backend endTime is returned.
 *
 * This reduces one HTTP request during initial exam loading.
 */
export const startAndGetExamQuestions = async (req, res) => {

    try {

        const { chapterId } = req.params;
        const userId = req.user.id;


        /*
         * Validate chapterId exactly as the existing
         * startExam and getExamQuestions endpoints do.
         */
        if (!mongoose.Types.ObjectId.isValid(chapterId)) {

            return res.status(400).json({
                status: 0,
                message: "Invalid chapterId",
            });
        }


        const chapterObjectId =
            new mongoose.Types.ObjectId(chapterId);


        /*
         * ====================================================
         * 1. CHECK EXISTING ACTIVE ATTEMPT
         * ====================================================
         *
         * This is the same lookup used by startExam.
         */
        let attempt = await ExamAttempt.findOne({
            userId,

            chapterId: chapterObjectId,

            isCompleted: false,
        });


        /*
         * ====================================================
         * 2. HANDLE EXISTING ATTEMPT
         * ====================================================
         */
        if (attempt) {

            /*
             * If the existing attempt has expired,
             * mark it completed and create a new attempt.
             *
             * This preserves the behavior of startExam.
             */
            if (new Date() > attempt.endTime) {

                attempt.isCompleted = true;

                await attempt.save();

                /*
                 * Do not return here.
                 *
                 * Continue below and create a new attempt,
                 * exactly like the existing startExam logic.
                 */
                attempt = null;
            }
        }


        /*
         * ====================================================
         * 3. CREATE NEW ATTEMPT WHEN REQUIRED
         * ====================================================
         */
        if (!attempt) {

            /*
             * Get exactly 5 random MCQs.
             *
             * This is the same aggregation used by startExam.
             */
            const mcqs = await McqsModel.aggregate([

                {
                    $match: {
                        chapterIds: chapterObjectId
                    }
                },

                {
                    $sample: {
                        size: 5
                    }
                },

                {
                    $project: {
                        _id: 1
                    }
                },

            ]);


            if (!mcqs || mcqs.length === 0) {

                return res.status(404).json({
                    status: 0,
                    message: "No MCQs found",
                });
            }


            /*
             * Keep the same MCQ ID structure used
             * by the existing ExamAttempt document.
             */
            const mcqIds =
                mcqs.map(q => q._id);


            /*
             * Keep the existing 10-minute duration.
             */
            const startTime = new Date();

            const endTime = new Date(
                startTime.getTime() +
                10 * 60 * 1000
            );


            /*
             * Create the attempt exactly as startExam does.
             */
            attempt = await createExamAttempt("chapter", {
                userId,
                chapterId: chapterObjectId,
                mcqIds,
                startTime,
                endTime,
            });
        }


        /*
         * ====================================================
         * 4. CHECK EXAM EXPIRATION
         * ====================================================
         *
         * This check is also present in getExamQuestions.
         */
        if (new Date() > attempt.endTime) {

            attempt.isCompleted = true;

            await attempt.save();

            return res.status(400).json({
                status: 0,
                message: "Exam time expired",
            });
        }


        /*
         * ====================================================
         * 5. POPULATE MCQS
         * ====================================================
         *
         * The attempt has already been found/created.
         *
         * Now populate the referenced MCQs in the same
         * request instead of making the frontend call
         * getExamQuestions separately.
         */
        await attempt.populate("mcqIds");


        /*
         * ====================================================
         * 6. RETURN EXAM DATA
         * ====================================================
         *
         * Response structure is intentionally kept compatible
         * with the existing getExamQuestions response.
         */
        return res.status(200).json({

            status: 1,

            data: {

                mcqs: attempt.mcqIds,

                endTime: attempt.endTime,

                answers: attempt.answers

            },

        });


    } catch (err) {

        console.log(
            "startAndGetExamQuestions error:",
            err
        );

        return res.status(500).json({
            status: 0,
            message: "Error"
        });
    }
};


/*
 * ============================================================
 * GET EXAM QUESTIONS
 * ============================================================
 *
 * Existing endpoint.
 *
 * Kept unchanged for compatibility with any other part of
 * the application that may already use this API.
 */
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

            chapterId:
                new mongoose.Types.ObjectId(chapterId),

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

        res.status(500).json({
            status: 0,
            message: "Error"
        });
    }
};


/*
 * ============================================================
 * SAVE ANSWER
 * ============================================================
 *
 * Existing answer-saving logic.
 *
 * No exam logic has been changed here.
 */
export const saveAnswer = async (req, res) => {

    try {

        const {
            mcqId,
            questionIndex,
            selectedOption
        } = req.body;

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

            chapterId:
                new mongoose.Types.ObjectId(chapterId),

            isCompleted: false,

        });


        if (!attempt) {

            return res.status(404).json({
                status: 0,
                message: "No attempt"
            });
        }


        if (new Date() > attempt.endTime) {

            return res.status(400).json({
                status: 0,
                message: "Time over, cannot save answer",
            });
        }


        /*
         * Update existing answer or insert a new answer.
         */
        const existing = attempt.answers.find(
            a =>
                a.mcqId.toString() === mcqId &&
                a.questionIndex === questionIndex
        );


        if (existing) {

            existing.selectedOption =
                selectedOption;

        } else {

            attempt.answers.push({

                mcqId,

                questionIndex,

                selectedOption

            });
        }


        await attempt.save();


        res.json({
            status: 1,
            message: "Saved"
        });


    } catch (err) {

        console.log(err);

        res.status(500).json({
            status: 0
        });
    }
};


/*
 * ============================================================
 * SUBMIT EXAM
 * ============================================================
 */
export const submitExam = async (req, res) => {

    try {

        const userId = req.user.id;
        const { chapterId } = req.params;


        /*
         * Validate
         */
        if (!mongoose.Types.ObjectId.isValid(chapterId)) {

            return res.status(400).json({
                status: 0,
                message: "Invalid chapterId",
            });
        }


        /*
         * Find attempt
         */
        const attempt = await ExamAttempt.findOne({

            userId,

            chapterId:
                new mongoose.Types.ObjectId(chapterId),

            isCompleted: false,

        }).populate("mcqIds");


        if (!attempt) {

            return res.status(404).json({
                status: 0,
                message: "No active attempt found",
            });
        }


        /*
         * Calculate score
         */
        let score = 0;
        let total = 0;


        attempt.answers.forEach(ans => {

            const mcq = attempt.mcqIds.find(
                m =>
                    m._id.toString() ===
                    ans.mcqId.toString()
            );


            if (!mcq) {
                return;
            }


            const question =
                mcq.questions?.[ans.questionIndex];


            if (!question) {
                return;
            }


            total++;


            if (
                question.correctAnswer ===
                ans.selectedOption
            ) {
                score++;
            }

        });


        /*
         * Calculate percentage
         */
        const percentage =
            total > 0
                ? ((score / total) * 100).toFixed(2)
                : 0;


        /*
         * Pass/fail logic
         */
        const isPassed =
            percentage >= 70;


        /*
         * DELETE attempt AFTER result calculation
         */
        await ExamAttempt.deleteOne({
            _id: attempt._id
        });


        /*
         * Response
         */
        return res.status(200).json({

            status: 1,

            score,

            total,

            percentage,

            isPassed,

        });


    } catch (err) {

        console.log(
            "Submit Exam Error:",
            err
        );


        return res.status(500).json({

            status: 0,

            message: "Internal Server Error",

        });
    }
};


/*
 * ========================================================================================
 * ========================================================================================
 * ========================================================================================
 * ================================== Final Exam ==========================================
 * ========================================================================================
 * ========================================================================================
 * ========================================================================================
 */


export const getFinalExamQuestions = async (req, res) => {

    try {

        const { code } = req.params;
        const { retry } = req.query;
        const userId = req.user.id;


        /*
         * Find language by code
         */
        const language =
            await LearningLanguagesModel.findOne({
                code
            });


        if (!language) {

            return res.status(404).json({
                status: 0,
                message: "Language not found",
            });
        }


        /*
         * Find existing active final exam attempt
         */
        let attempt =
            await ExamAttempt.findOne({
                userId,
                langId: language._id,
                examType: "final",
                isCompleted: false,
            }).populate("mcqIds");


        /*
         * RETRY:
         * Delete the existing attempt so a completely
         * new attempt can be created.
         */
        if (attempt && retry === "true") {

            await ExamAttempt.deleteOne({
                _id: attempt._id
            });

            attempt = null;
        }


        /*
         * Create new attempt if there is no active attempt
         */
        if (!attempt) {

            const chapterIds =
                language.chapters;


            /*
             * Fetch MCQs that belong to those chapters
             */
            const mcqs =
                await McqsModel.find({
                    chapterIds: {
                        $in: chapterIds
                    }
                });


            if (!mcqs.length) {

                return res.status(404).json({
                    status: 0,
                    message:
                        "No MCQs found for this language",
                });
            }


            /*
             * Shuffle MCQs
             */
            const shuffled =
                mcqs.sort(
                    () => 0.5 - Math.random()
                );


            /*
             * Select MCQs until at least
             * 15 questions are available.
             */
            let selectedMcqs = [];

            let questionCount = 0;


            for (let mcq of shuffled) {

                selectedMcqs.push(mcq);

                questionCount +=
                    mcq.questions?.length || 0;


                if (questionCount >= 15) {
                    break;
                }
            }


            /*
             * Create 15-minute exam
             */
            const startTime =
                new Date();


            const endTime =
                new Date(
                    startTime.getTime() +
                    15 * 60 * 1000
                );


            /*
             * Create new attempt
             */
            attempt = await createExamAttempt("final", {
                userId,
                langId: language._id,
                mcqIds: selectedMcqs.map(q => q._id),
                startTime,
                endTime,
            });
        }


        /*
         * IMPORTANT:
         * populate MCQ documents because a newly created
         * attempt initially contains only ObjectIds.
         */
        await attempt.populate("mcqIds");


        /*
         * Check whether exam time has expired
         */
        if (new Date() > attempt.endTime) {

            /*
             * Calculate score
             */
            let score = 0;
            let total = 0;


            attempt.mcqIds.forEach((mcq) => {

                mcq.questions?.forEach(
                    (question, index) => {

                        total++;


                        const userAnswer =
                            attempt.answers.find(
                                a =>
                                    a.mcqId?.toString() ===
                                    mcq._id.toString() &&
                                    a.questionIndex ===
                                    index
                            );


                        if (
                            userAnswer &&
                            Number(
                                userAnswer.selectedOption
                            ) ===
                            Number(
                                question.correctAnswer
                            )
                        ) {

                            score++;
                        }

                    }
                );
            });


            /*
             * Calculate percentage
             */
            const percentage =
                total > 0
                    ? ((score / total) * 100).toFixed(2)
                    : 0;


            /*
             * Pass/fail
             */
            const isPassed =
                percentage >= 70;


            /*
             * Delete expired attempt
             */
            await ExamAttempt.deleteOne({
                _id: attempt._id
            });


            return res.status(200).json({

                status: 1,

                score,

                total,

                percentage,

                isPassed,

                message:
                    "Time expired - auto submitted"

            });
        }


        /*
         * Return active exam
         */
        return res.status(200).json({

            status: 1,

            data: {

                mcqs:
                    attempt.mcqIds,

                endTime:
                    attempt.endTime,

                answers:
                    attempt.answers,

            },

        });


    } catch (err) {

        console.log(
            "Get Final Exam Questions Error:",
            err
        );


        return res.status(500).json({

            status: 0,

            message: "Error"

        });
    }
};

export const submitFinalExam = async (req, res) => {

    try {

        const { code } = req.params;
        const userId = req.user.id;


        const language =
            await LearningLanguagesModel.findOne({
                code
            });


        if (!language) {

            return res.status(404).json({
                status: 0,
                message: "Language not found",
            });
        }


        const attempt =
            await ExamAttempt.findOne({

                userId,

                langId:
                    language._id,

                examType:
                    "final",

                isCompleted:
                    false,

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

            mcq.questions?.forEach(
                (question, index) => {

                    total++;


                    const userAnswer =
                        attempt.answers.find(
                            a =>
                                a.mcqId?.toString() ===
                                mcq._id.toString() &&
                                a.questionIndex === index
                        );


                    if (
                        userAnswer &&
                        Number(
                            userAnswer.selectedOption
                        ) ===
                        Number(
                            question.correctAnswer
                        )
                    ) {

                        score++;
                    }

                }
            );
        });


        await ExamAttempt.deleteOne({
            _id: attempt._id
        });


        const percentage =
            total > 0
                ? ((score / total) * 100).toFixed(2)
                : 0;


        const isPassed =
            percentage >= 70;


        const user =
            await UserModel.findById(userId);


        try {

            await sendMail(

                user.email,

                "Final Exam Result",

                "finalExam",

                {

                    percentage,

                    isPassed,

                    language:
                        `${language.english} (${language.native})`,

                }

            );

        } catch (error) {

            console.log(error);
        }


        if (isPassed) {

            const progress =
                await UserProgressModel.findOne({
                    userId
                });


            if (progress) {

                const langIndex =
                    progress.learningLanguages.findIndex(

                        (l) =>
                            l.languageId.toString() ===
                            language._id.toString()

                    );


                if (langIndex !== -1) {

                    /*
                     * Prevent overwrite
                     */
                    if (
                        !progress
                            .learningLanguages[langIndex]
                            .isCourseCompleted
                    ) {

                        progress
                            .learningLanguages[langIndex]
                            .isCourseCompleted = true;
                    }


                    /*
                     * Save completion time
                     */
                    progress
                        .learningLanguages[langIndex]
                        .completedAt = new Date();


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

        res.status(500).json({
            status: 0,
            message: "Error"
        });
    }
};


export const saveFinalAnswer = async (req, res) => {

    try {

        const {
            code
        } = req.params;


        const {
            mcqId,
            questionIndex,
            selectedOption
        } = req.body;


        const userId =
            req.user.id;


        const language =
            await LearningLanguagesModel.findOne({
                code
            });


        if (!language) {

            return res.status(404).json({
                status: 0,
                message: "Language not found"
            });
        }


        const attempt =
            await ExamAttempt.findOne({

                userId,

                langId:
                    language._id,

                examType:
                    "final",

                isCompleted:
                    false,

            });


        if (!attempt) {

            return res.status(404).json({
                status: 0,
                message: "No attempt"
            });
        }


        if (new Date() > attempt.endTime) {

            return res.status(400).json({
                status: 0,
                message: "Time over",
            });
        }


        const existing =
            attempt.answers.find(

                a =>
                    a.mcqId?.toString() ===
                    mcqId &&
                    a.questionIndex ===
                    questionIndex

            );


        if (existing) {

            existing.selectedOption =
                selectedOption;

        } else {

            attempt.answers.push({

                mcqId,

                questionIndex,

                selectedOption

            });
        }


        await attempt.save();


        res.json({
            status: 1,
            message: "Saved"
        });


    } catch (err) {

        console.log(err);

        res.status(500).json({
            status: 0
        });
    }
};