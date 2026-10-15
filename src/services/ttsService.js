
import axios from "axios";

const TTS_URL = process.env.REACT_APP_TTS_URL;

export const synthesizeSpeech = async (text, language = "en") => {
    const startTime = performance.now();

    try {
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

        console.log(
            `[TTS Service] Request completed in ${
                (performance.now() - startTime).toFixed(0)
            } ms`
        );

        console.log(
            `[TTS Service] Audio size: ${
                (response.data.size / 1024).toFixed(2)
            } KB`
        );

        return response.data;
    } catch (error) {
        console.error("[TTS Service] Request failed:", error);
        throw error;
    }
};
