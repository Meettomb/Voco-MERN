/**
 * Architectural Pattern: Service Layer
 *
 * Encapsulates chapter-related API communication and caching logic.
 * Keeps HTTP requests separate from React component logic.
 *
 * Benefits:
 * - Improves code reusability.
 * - Simplifies testing and maintenance.
 * - Centralizes chapter data retrieval.
 */

import apiClient, { getAuthConfig } from "./apiClient";
import apiCache from "./ApiCache";

const CHAPTER_TTL_MS = 5 * 60 * 1000;

const LearningWordsService = {
    async getChapter({ chapterId, userId, token, apiUrl, signal }) {
        // Include user scope so user-specific responses cannot leak between accounts.
        const cacheKey = `chapter:${String(userId)}:${String(chapterId)}`;

        if (apiCache.has(cacheKey)) {
            return apiCache.get(cacheKey);
        }

        const response = await apiClient.get(
            `${apiUrl}/LearningWordsModel/getLearningWords/${encodeURIComponent(chapterId)}`,
            getAuthConfig(token, { signal })
        );

        if (response.data?.status !== 1 || !response.data?.data) {
            return null;
        }

        apiCache.set(cacheKey, response.data.data, CHAPTER_TTL_MS);
        return response.data.data;
    },

    invalidateChapter({ chapterId, userId }) {
        apiCache.invalidate(`chapter:${String(userId)}:${String(chapterId)}`);
    },
};

export default LearningWordsService;
