import { useState } from "react";
import { sendMessageToAI } from "../services/aiService";

const useAIConversation = (language) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (message) => {
    if (!message?.trim() || loading) {
      return null;
    }

    const cleanMessage = message.trim();

    setLoading(true);
    setError("");

    const userMessage = {
      role: "user",
      content: cleanMessage
    };

    /*
     * History sent to Qwen should contain the
     * conversation BEFORE the current message.
     */
    const history = messages.map((item) => ({
      role: item.role,
      content: item.content
    }));

    // Show user message immediately
    setMessages((previous) => [
      ...previous,
      userMessage
    ]);

    try {
      const response = await sendMessageToAI({
        message: cleanMessage,
        language,
        history
      });

      if (!response?.success) {
        throw new Error(
          response?.message || "AI response failed"
        );
      }

      const assistantMessage = {
        role: "assistant",
        content: response.reply
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage
      ]);

      return response.reply;

    } catch (err) {
      console.error("VOCO AI error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Unable to connect to VOCO AI.";

      setError(errorMessage);

      return null;

    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setError("");
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearConversation
  };
};

export default useAIConversation;