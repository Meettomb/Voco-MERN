import { chatWithOllama } from "../services/ai/ollama.service.js";
import { transcribeAudio } from "../services/speech/sttService.js";

export const chatWithAI = async (req, res) => {
    try {
        const {
            message,
            language = "en",
            history = []
        } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const reply = await chatWithOllama({
            message,
            language,
            history
        });

        return res.status(200).json({
            success: true,
            reply
        });

    } catch (error) {
        console.error("AI Error:", error);

        return res.status(500).json({
            success: false,
            message: "AI service failed",
            error: error.message
        });
    }
};

export const transcribeSpeech = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required"
      });
    }

    const language = req.body.language || "en";

    const result = await transcribeAudio(
      req.file.buffer,
      req.file.originalname,
      language
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error("STT Error:", error);

    return res.status(500).json({
      success: false,
      message: "Speech-to-text service failed",
      error: error.response?.data?.message || error.message
    });
  }
};