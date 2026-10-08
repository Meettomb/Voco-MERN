import axios from "axios";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const transcribeAudio = async (audioBlob, language = "en") => {
  const formData = new FormData();

  formData.append("audio", audioBlob, "recording.webm");
  formData.append("language", language);

  const response = await axios.post(
    `${REACT_APP_API_URL}/ai/transcribe`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
};