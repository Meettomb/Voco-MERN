import axios from "axios";

const TTS_URL = process.env.REACT_APP_TTS_URL;

export const synthesizeSpeech = async (text, language = "en") => {
  const response = await axios.post(
    `${TTS_URL}/synthesize`,
    {
      text,
      language
    },
    {
      responseType: "blob"
    }
  );

  return response.data;
};