import { getConversationSystemPrompt } from "./prompts/conversationPrompt.js";
import {
    getConversationAnalysisPrompt,
    getConversationAnalysisSystemPrompt,
} from "./prompts/conversationAnalysisPrompt.js";

const MODEL = "qwen3:1.7b";

const getOllamaUrl = () => {
    const ollamaUrl = process.env.OLLAMA_URL;

    if (!ollamaUrl) {
        throw new Error("OLLAMA_URL is not configured");
    }

    return ollamaUrl;
};

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

    const systemPrompt = getConversationSystemPrompt(language);

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

    const response = await fetch(`${getOllamaUrl()}/api/chat`, {
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


export const analyzeConversationWithOllama = async ({
    language,
    messages,
}) => {
    const languageCode =
        typeof language === "object"
            ? language?.code
            : language;

    const languageName =
        languageCode === "hi" ? "Hindi" : "English";

    // --------------------------------------------------
    // 1. Validate and prepare the conversation
    // --------------------------------------------------

    if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error("Conversation messages are required");
    }

    const validMessages = messages.filter(
        (message) =>
            ["user", "assistant"].includes(message.role) &&
            typeof message.content === "string" &&
            message.content.trim().length > 0
    );

    const learnerMessages = validMessages.filter(
        (message) => message.role === "user"
    );

    const spokenMessageCount = learnerMessages.filter(
        (message) => message.inputMode === "speech"
    ).length;

    const typedMessageCount = learnerMessages.filter(
        (message) => message.inputMode === "text"
    ).length;

    const learnerMessageCount = learnerMessages.length;

    let interactionMode = "text";

    if (spokenMessageCount > 0 && typedMessageCount > 0) {
        interactionMode = "mixed";
    } else if (spokenMessageCount > 0) {
        interactionMode = "speech";
    }

    if (learnerMessages.length === 0) {
        throw new Error(
            "No learner messages available for evaluation"
        );
    }

    const transcript = validMessages
        .map((message) => {
            const speaker =
                message.role === "user" ? "Learner" : "VOCO";

            return `${speaker}: ${message.content.trim()}`;
        })
        .join("\n");

    const totalLearnerCharacters = learnerMessages.reduce(
        (total, message) =>
            total + message.content.trim().length,
        0
    );

    const learnerWordCount = learnerMessages.reduce(
        (total, message) => {
            const words = message.content
                .trim()
                .split(/\s+/)
                .filter(Boolean);

            return total + words.length;
        },
        0
    );

    const hasEnoughEvidence =
        learnerMessages.length >= 3 &&
        totalLearnerCharacters >= 50;

    // --------------------------------------------------
    // 2. Build an evidence-based evaluation prompt
    // --------------------------------------------------

    const prompt = getConversationAnalysisPrompt({
        languageName,
        learnerMessages,
        learnerWordCount,
        totalLearnerCharacters,
        hasEnoughEvidence,
        transcript,
    });

    // --------------------------------------------------
    // 3. Request evaluation from Ollama
    // --------------------------------------------------

    const response = await fetch(
        `${getOllamaUrl()}/api/chat`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: "system",
                        content: getConversationAnalysisSystemPrompt(),
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                stream: false,
                think: false,
                format: "json",
                keep_alive: "10m",
                options: {
                    temperature: 0,
                    num_ctx: 8192,
                    num_predict: 700,
                },
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text().catch(
            () => ""
        );

        throw new Error(
            `Ollama analysis error: ${response.status}` +
            (errorText ? ` - ${errorText}` : "")
        );
    }

    const data = await response.json();

    console.log("========== OLLAMA REPORT PERFORMANCE ==========");
    console.log(
        "Model Load Time:",
        `${(data.load_duration / 1e9).toFixed(2)} seconds`
    );
    console.log(
        "Prompt Evaluation Time:",
        `${(data.prompt_eval_duration / 1e9).toFixed(2)} seconds`
    );
    console.log(
        "Response Generation Time:",
        `${(data.eval_duration / 1e9).toFixed(2)} seconds`
    );
    console.log(
        "Total Ollama Time:",
        `${(data.total_duration / 1e9).toFixed(2)} seconds`
    );
    console.log("Prompt Tokens:", data.prompt_eval_count);
    console.log("Generated Tokens:", data.eval_count);
    console.log("================================================");

    const content = data.message?.content;

    if (
        typeof content !== "string" ||
        content.trim().length === 0
    ) {
        throw new Error("Ollama returned an empty report");
    }

    // --------------------------------------------------
    // 4. Parse and validate the report
    // --------------------------------------------------

    let report;

    try {
        report = JSON.parse(content);
    } catch {
        throw new Error(
            "Ollama returned invalid report JSON"
        );
    }

    const scoreFields = [
        "grammarScore",
        "vocabularyScore",
        "fluencyScore",
        "comprehensionScore",
        "conversationQualityScore",
    ];

    for (const field of scoreFields) {
        if (
            !Number.isInteger(report[field]) ||
            report[field] < 0 ||
            report[field] > 100
        ) {
            throw new Error(
                `Invalid report score: ${field}`
            );
        }
    }

    // Pronunciation is not assessed by this function.
    // Ignore any unsupported pronunciation score from Ollama.

    report.pronunciationScore = null;

    const arrayFields = [
        "strengths",
        "improvements",
        "practiceWords",
    ];

    for (const field of arrayFields) {
        if (
            !Array.isArray(report[field]) ||
            !report[field].every(
                (item) =>
                    typeof item === "string" &&
                    item.trim().length > 0
            )
        ) {
            throw new Error(
                `Invalid report field: ${field}`
            );
        }

        report[field] = report[field]
            .map((item) => item.trim());
    }

    if (
        typeof report.feedback !== "string" ||
        report.feedback.trim().length === 0
    ) {
        throw new Error("Invalid report feedback");
    }

    // --------------------------------------------------
    // 5. Calculate overall score in JavaScript
    // --------------------------------------------------

    // Grammar:              25%
    // Vocabulary:           20%
    // Fluency:              20%
    // Comprehension:        20%
    // Conversation Quality: 15%

    const weights = {
        grammarScore: 0.25,
        vocabularyScore: 0.20,
        fluencyScore: 0.20,
        comprehensionScore: 0.20,
        conversationQualityScore: 0.15,
    };

    const overallScore = Math.round(
        scoreFields.reduce(
            (total, field) =>
                total + report[field] * weights[field],
            0
        )
    );

    // --------------------------------------------------
    // 6. Make feedback consistent with the evidence limit
    // --------------------------------------------------

    let feedback = report.feedback.trim();

    if (!hasEnoughEvidence) {
        const limitation =
            languageCode === "hi"
                ? "ध्यान दें: यह बातचीत छोटी थी, इसलिए मूल्यांकन सीमित जानकारी पर आधारित है। अधिक सटीक आकलन के लिए लंबी बातचीत करें।"
                : "Assessment note: This conversation was short, so the evaluation is preliminary. A longer conversation would provide stronger evidence of your language skills.";

        feedback = `${feedback} ${limitation}`;
    }

    // --------------------------------------------------
    // 7. Return the report
    // --------------------------------------------------

    return {
        overallScore,

        grammarScore: report.grammarScore,
        vocabularyScore: report.vocabularyScore,
        fluencyScore: report.fluencyScore,
        pronunciationScore: null,
        comprehensionScore: report.comprehensionScore,
        conversationQualityScore:
            report.conversationQualityScore,

        interactionMode,
        learnerMessageCount,
        spokenMessageCount,
        typedMessageCount,

        strengths: report.strengths.slice(0, 4),
        improvements: report.improvements.slice(0, 4),
        practiceWords: report.practiceWords.slice(0, 5),
        corrections: report.corrections,

        feedback,
    };
};