
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Existing function: send a message to VOCO AI
export const sendMessageToAI = async ({
  message,
  language,
  history = [],
}) => {
  const response = await axios.post(
    `${API_URL}/ai/chat`,
    {
      message,
      language,
      history,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// Create a conversation in MongoDB
// Create a conversation with the learner's first input
export const createConversation = async ({
  language,
  content,
  inputMode,
  openingMessage,
}) => {
  const response = await axios.post(
    `${API_URL}/conversations`,
    {
      language,
      content,
      inputMode,
      openingMessage,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// Save a user or AI message in MongoDB
export const saveConversationMessage = async ({
  conversationId,
  role,
  content,
  inputMode,
}) => {
  const response = await axios.post(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      role,
      content,
      ...(role === "user" && inputMode
        ? { inputMode }
        : {}),
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// End conversation and generate its performance report
export const endConversation = async (conversationId) => {
  const response = await axios.post(
    `${API_URL}/conversations/${conversationId}/end`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

// Retrieve an existing performance report
export const getConversationReport = async (conversationId) => {
  const response = await axios.get(
    `${API_URL}/conversations/${conversationId}/report`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};




export const getConversationList = async (page = 1) => {
  const response = await axios.get(
    `${API_URL}/conversations?page=${page}`,
    { headers: getAuthHeaders() }
  );

  return response.data;
};

export const deleteConversation = async (conversationId) => {
  const response = await axios.delete(
    `${API_URL}/conversations/${conversationId}`,
    { headers: getAuthHeaders() }
  );

  return response.data;
};

export const getSingleConversation = async (conversationId) => {
  const response = await axios.get(
    `${API_URL}/conversations/${conversationId}`,
    {headers: getAuthHeaders()}
  );

  return response.data;
};