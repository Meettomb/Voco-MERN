import { useState, useEffect } from "react";

const useMessage = (duration = 2000) => {
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
    };

    const clearMessage = () => {
        setMessage(null);
        setMessageType(null);
    };

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            clearMessage();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration]);

    return {
        message,
        messageType,
        showMessage,
        clearMessage
    };
};

export default useMessage;