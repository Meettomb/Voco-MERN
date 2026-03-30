import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import getUser from "../utils/getUser";

export default function AuthRoute({ children, onAuthFail }) {
    const user = getUser();   // IMPORTANT
    const isAuthenticated = !!user;

    useEffect(() => {
        if (!isAuthenticated && onAuthFail) {
            onAuthFail();
        }
    }, [isAuthenticated, onAuthFail]);

    return isAuthenticated ? children : <Navigate to="/" />;
}