/**
 * Design Pattern: Proxy Pattern
 *
 * Acts as an intermediary between API services and the cache.
 * Checks whether valid data is available in the cache before
 * allowing another API request.
 *
 * Performance Benefits:
 * - Reduces repeated API requests.
 * - Improves response times for cached data.
 * - Uses TTL (Time To Live) to expire stale cache entries.
 */
class ApiCache {
    constructor() {
        this.entries = new Map();
    }

    has(key) {
        const entry = this.entries.get(key);
        if (!entry) return false;

        if (Date.now() >= entry.expiresAt) {
            this.entries.delete(key);
            return false;
        }

        return true;
    }

    get(key) {
        if (!this.has(key)) return undefined;
        return this.entries.get(key).data;
    }

    set(key, data, ttlMs) {
        this.entries.set(key, {
            data,
            expiresAt: Date.now() + ttlMs,
        });
    }

    invalidate(key) {
        this.entries.delete(key);
    }

    invalidatePrefix(prefix) {
        for (const key of this.entries.keys()) {
            if (key.startsWith(prefix)) this.entries.delete(key);
        }
    }

    clear() {
        this.entries.clear();
    }
}

const apiCache = new ApiCache();
export default apiCache;
