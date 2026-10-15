import axios from "axios";
import FormData from "form-data";

const STT_URL = process.env.STT_URL;

export const transcribeAudio = async (
  audioBuffer,
  filename,
  language
) => {
  const formData = new FormData();

  formData.append("audio", audioBuffer, {
    filename,
    contentType: "audio/webm"
  });

  formData.append("language", language);

  try {
    const response = await axios.post(
      `${STT_URL}/transcribe`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    return response.data;
  } catch (error) {
    console.error("STT upstream URL:", `${STT_URL}/transcribe`);
    console.error("STT upstream status:", error.response?.status);
    console.error("STT upstream response:", error.response?.data);
    console.error("STT upstream message:", error.message);

    throw error;
  }
};