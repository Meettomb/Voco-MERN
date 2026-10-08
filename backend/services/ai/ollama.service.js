const OLLAMA_URL = process.env.OLLAMA_URL;

const MODEL = "qwen3:1.7b";

export const chatWithOllama = async ({
    message,
    language = "en",
    history = []
}) => {

    // Support both:
    // language = "hi"
    // language = { code: "hi", english: "Hindi" }

    const languageCode =
        typeof language === "object"
            ? language?.code
            : language;

    const languageMap = {
        en: "English",
        hi: "Hindi"
    };

    const languageName =
        languageMap[languageCode] || "English";

    const systemPrompt = `
You are VOCO, an AI language-learning conversation partner.

The learner selected ${languageName}.

Your job:
- Have a natural conversation with the learner.
- Respond in ${languageName}.
- Keep responses short and conversational.
- Ask only one question at a time.
- Encourage the learner to continue speaking.
- Do not give long explanations unless requested.
- Do not use markdown.
- Do not reveal your internal reasoning.
- Focus on natural conversation.

You are NOT a general-purpose assistant.
You are a language-learning conversation partner.
`;

    const messages = [
        {
            role: "system",
            content: systemPrompt
        },
        ...history,
        {
            role: "user",
            content: message
        }
    ];

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: MODEL,
            messages,
            stream: false,
            think: false,
            options: {
                temperature: 0.7,
                num_ctx: 2048
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();

    return data.message?.content || "";
};