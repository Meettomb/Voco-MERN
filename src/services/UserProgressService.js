/**
 * Architectural Pattern: Service Layer
 *
 * Encapsulates user progress API operations, including retrieving
 * completed chapters and updating chapter completion status.
 *
 * Benefits:
 * - Separates business operations from UI components.
 * - Supports consistent error handling.
 * - Centralizes progress cache invalidation.
 */

import apiClient, { getAuthConfig } from "./apiClient";
import apiCache from "./ApiCache";

const PROGRESS_TTL_MS = 30 * 1000;

const getProgressCacheKey = (userId, languageId) =>
    `progress:${String(userId)}:${String(languageId)}`;

const UserProgressService = {
    async getProgress({ userId, languageId, token, apiUrl, signal }) {
        if (!languageId) return [];

        const cacheKey = getProgressCacheKey(userId, languageId);
        if (apiCache.has(cacheKey)) return apiCache.get(cacheKey);

        const response = await apiClient.get(
            `${apiUrl}/UserProgressModel/user-progress/${encodeURIComponent(languageId)}`,
            getAuthConfig(token, { signal })
        );

        const completedChapters =
            response.data?.status === 1
                ? response.data?.data?.completedChapters || []
                : [];

        apiCache.set(cacheKey, completedChapters, PROGRESS_TTL_MS);
        return completedChapters;
    },

    async markComplete({ userId, languageId, chapterId, token, apiUrl }) {
        const response = await apiClient.post(
            `${apiUrl}/UserProgressModel/mark-complete`,
            { userId, languageId, chapterId },
            getAuthConfig(token)
        );

        // Always invalidate progress cache after a successful mutation.
        if (response.data?.status === 1) {
            apiCache.invalidate(getProgressCacheKey(userId, languageId));
        }

        return response.data;
    },
};

export default UserProgressService;
