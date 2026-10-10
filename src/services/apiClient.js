/**
 * Design Pattern: Singleton Pattern
 *
 * Exports a shared, configured Axios instance for API communication.
 *
 * Benefits:
 * - Reuses common HTTP configuration.
 * - Centralizes authentication headers and interceptors.
 * - Avoids repeatedly creating Axios instances.
 */

import axios from "axios";

// Singleton-style shared Axios instance: one place for common HTTP defaults.
const apiClient = axios.create({
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getAuthConfig = (token, extra = {}) => ({
    ...extra,
    headers: {
        ...(extra.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
});

export default apiClient;
