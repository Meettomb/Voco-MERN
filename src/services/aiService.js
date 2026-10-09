import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const sendMessageToAI = async ({
  message,
  language,
  history = []
}) => {
  const response = await axios.post(
    `${API_URL}/ai/chat`,
    {
      message,
      language,
      history
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  return response.data;
};