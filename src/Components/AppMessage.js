import React from "react";

const AppMessage = ({ message, messageType }) => {
    if (!message) return null;

    return (
        <p
            className={`app-message ${
                messageType === "success" ? "success" : "error"
            }`}
        >
            {message}
        </p>
    );
};

export default AppMessage;