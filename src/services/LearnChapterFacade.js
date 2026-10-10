/**
 * Design Pattern: Facade Pattern
 *
 * Provides a simplified interface for retrieving chapter data
 * and user progress from multiple services.
 *
 * Performance Benefits:
 * - Allows independent API requests to run concurrently.
 * - Reduces sequential waiting time.
 * - Centralizes data retrieval and orchestration logic.
 */

import LearningWordsService from "./LearningWordsService";
import UserProgressService from "./UserProgressService";

// Facade pattern: the page calls one API for all data it needs.
const LearnChapterFacade = {
    async getChapterPageData({
        chapterId,
        languageId,
        userId,
        token,
        apiUrl,
        signal,
    }) {
        // These requests are independent, so start them concurrently.
        const [chapterResult, progressResult] = await Promise.allSettled([
            LearningWordsService.getChapter({
                chapterId,
                userId,
                token,
                apiUrl,
                signal,
            }),
            UserProgressService.getProgress({
                userId,
                languageId,
                token,
                apiUrl,
                signal,
            }),
        ]);

        if (chapterResult.status === "rejected") {
            // A chapter failure is fatal to this page; preserve the real error.
            throw chapterResult.reason;
        }

        return {
            chapter: chapterResult.value,
            completedChapters:
                progressResult.status === "fulfilled"
                    ? progressResult.value
                    : null,
            progressError:
                progressResult.status === "rejected"
                    ? progressResult.reason
                    : null,
        };
    },

    markChapterComplete({ userId, languageId, chapterId, token, apiUrl }) {
        return UserProgressService.markComplete({
            userId,
            languageId,
            chapterId,
            token,
            apiUrl,
        });
    },
};

export default LearnChapterFacade;
