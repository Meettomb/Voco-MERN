import { jwtDecode } from "jwt-decode";

export default function getUser() {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const decoded = jwtDecode(token);

        // Expiry check
        if (decoded.exp * 1000 < Date.now()) {
            // Token expired
            localStorage.removeItem("token");
            return null;
        }

        return decoded;

    } catch (error) {
        localStorage.removeItem("token");
        return null;
    }
}