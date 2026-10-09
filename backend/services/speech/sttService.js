import axios from "axios";
import FormData from "form-data";

const STT_URL = "http://127.0.0.1:8001";

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
};