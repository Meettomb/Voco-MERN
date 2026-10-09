import ExamAttempt from "../../model/ExamAttemptModel.js";

const createChapterExamAttempt = async ({
    userId,
    chapterId,
    mcqIds,
    startTime,
    endTime
}) => {
    return await ExamAttempt.create({
        userId,
        chapterId,
        examType: "chapter",
        mcqIds,
        startTime,
        endTime
    });
};

const createFinalExamAttempt = async ({
    userId,
    langId,
    mcqIds,
    startTime,
    endTime
}) => {
    return await ExamAttempt.create({
        userId,
        langId,
        examType: "final",
        mcqIds,
        answers: [],
        startTime,
        endTime,
        isCompleted: false
    });
};

export const createExamAttempt = async (examType, data) => {

    switch (examType) {

        case "chapter":
            return await createChapterExamAttempt(data);

        case "final":
            return await createFinalExamAttempt(data);

        default:
            throw new Error(`Unsupported exam type: ${examType}`);
    }
};