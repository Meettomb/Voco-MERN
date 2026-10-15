import React, { useEffect, useState, useRef } from "react";
import { transcribeAudio } from "../services/sttService";
import { synthesizeSpeech } from "../services/ttsService";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

import usePageTitle from "../hooks/usePageTitle";
import useAIConversation from "../hooks/useAIConversation";
import { getRandomOpeningQuestion } from "../utils/aiGreeting";

import {
    createConversation as createConversationAPI,
    saveConversationMessage,
    endConversation as endConversationAPI,
} from "../services/aiService";

import FullScreenLoader from "./FullScreenLoader";

export default function AiBasedLearning() {
    const location = useLocation();
    const { t } = useTranslation();

    usePageTitle("AI-Based Learning");

    const { uiLanguage } = useAuth();
    const audioChunksRef = useRef([]);

    const mediaRecorderRef = useRef(null);
    const audioStreamRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const silenceCheckRef = useRef(null);

    const hasSpeechStartedRef = useRef(false);
    const recordingStartTimeRef = useRef(null);


    const conversationIdRef = useRef(null);

    const [performanceReport, setPerformanceReport] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);
    const [reportError, setReportError] = useState("");

    /*
     * Get selected language from navigation.
     *
     * If the user refreshes the page, recover it
     * from localStorage.
     */
    const [activeLanguage, setActiveLanguage] = useState(() => {
        if (location.state?.language) {
            return location.state.language;
        }

        try {
            const savedLanguage = localStorage.getItem(
                "vocoActiveLanguage"
            );

            return savedLanguage
                ? JSON.parse(savedLanguage)
                : null;

        } catch (error) {
            console.error(
                "Failed to load active language:",
                error
            );

            return null;
        }
    });

    /*
     * Keep language synchronized with navigation.
     */
    useEffect(() => {
        if (!location.state?.language) {
            return;
        }

        setActiveLanguage(location.state.language);

        localStorage.setItem(
            "vocoActiveLanguage",
            JSON.stringify(location.state.language)
        );
    }, [location.state]);

    /*
     * Language code sent to backend.
     */
    const languageCode = activeLanguage?.code || "en";

    const ensureConversation = async () => {
        if (conversationIdRef.current) {
            return conversationIdRef.current;
        }

        const response = await createConversationAPI(languageCode);

        if (!response?.success || !response?.conversationId) {
            throw new Error("Unable to create conversation in MongoDB.");
        }

        conversationIdRef.current = response.conversationId;

        return response.conversationId;
    };

    const persistMessage = async (role, content) => {
        if (!content?.trim()) return;

        const conversationId = await ensureConversation();

        await saveConversationMessage({
            conversationId,
            role,
            content: content.trim(),
        });
    };


    const languageName =
        languageCode === "hi"
            ? "Hindi"
            : "English";

    /*
     * AI conversation.
     */
    const {
        messages,
        loading,
        error,
        sendMessage,
        addAssistantMessage,
        clearConversation
    } = useAIConversation(languageCode);

    const [input, setInput] = useState("");

    const [isListening, setIsListening] =
        useState(false);

    const [isAiSpeaking, setIsAiSpeaking] = useState(false);

    const [conversationEnded, setConversationEnded] = useState(false);


    const [conversationRun, setConversationRun] = useState(0);
    const hasStartedConversationRef = useRef(false);

    /*
     * Start the conversation automatically.
     */
    useEffect(() => {
        if (!activeLanguage?.code) return;

        if (hasStartedConversationRef.current) {
            return;
        }

        if (messages.length > 0) {
            return;
        }

        hasStartedConversationRef.current = true;



        const startConversation = async () => {
            const startTime = performance.now();

            try {
                console.log("[AI] Startup started");

                setIsAiSpeaking(true);

                const greeting = getRandomOpeningQuestion(
                    uiLanguage,
                    languageCode
                );

                await ensureConversation();

                addAssistantMessage(greeting);
                await persistMessage("assistant", greeting);

                console.log(
                    `[AI] Greeting displayed: ${(performance.now() - startTime).toFixed(0)
                    } ms`
                );

                await speakAIResponse(greeting);

                console.log(
                    `[AI] Greeting playback finished: ${(performance.now() - startTime).toFixed(0)
                    } ms`
                );
            } catch (error) {
                console.error("Failed to start AI conversation:", error);
            } finally {
                setIsAiSpeaking(false);
            }
        };

        startConversation();

    }, [activeLanguage?.code, languageCode, conversationRun]);

    // const getInitialGreeting = (uiLang, learningLang) => {
    //     if (uiLang === "hi" && learningLang === "en") {
    //         return "नमस्ते! VOCO में आपका स्वागत है। चलिए, अंग्रेज़ी बोलने का अभ्यास शुरू करते हैं। आज आप कैसे हैं?";
    //     }

    //     if (uiLang === "en" && learningLang === "hi") {
    //         return "Hello! Welcome to VOCO. Let's practise speaking Hindi together. आज आपका दिन कैसा रहा?";
    //     }

    //     if (uiLang === "hi" && learningLang === "hi") {
    //         return "नमस्ते! VOCO में आपका स्वागत है। आज आप कैसे हैं? चलिए, हिंदी में बातचीत शुरू करते हैं।";
    //     }

    //     return "Hello! Welcome to VOCO English speaking practice. How are you today? Let's start with a simple question: What did you do today?";
    // };

    /*
     * Latest AI message.
     */
    const latestAIMessage =
        [...messages]
            .reverse()
            .find(
                (message) =>
                    message.role === "assistant"
            )?.content ||
        (
            languageCode === "hi"
                ? "नमस्ते! चलिए बातचीत शुरू करते हैं।"
                : "Hello! Let's start our conversation."
        );

    /*
     * Latest user message.
     */
    const latestUserMessage =
        [...messages]
            .reverse()
            .find(
                (message) =>
                    message.role === "user"
            )?.content || "";

    /*
     * Temporary text conversation.
     *
     * Later microphone → Whisper will call
     * the exact same sendMessage() function.
     */
    const handleSendMessage = async (event) => {
        event?.preventDefault();

        if (!input.trim() || loading) {
            return;
        }

        const message = input.trim();

        setInput("");


        setIsAiSpeaking(true);

        try {
            await ensureConversation();
            await persistMessage("user", message);

            const reply = await sendMessage(message);

            if (reply) {
                await persistMessage("assistant", reply);
            }
        } catch (error) {
            console.error("Failed to save conversation:", error);
        } finally {
            setIsAiSpeaking(false);
        }

    };

    /*
     * Temporary microphone state.
     *
     * Real microphone implementation comes
     * after this text conversation works.
     */
    const toggleListening = async () => {
        if (loading || isAiSpeaking) return;

        // Manual stop
        if (isListening) {
            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state === "recording"
            ) {
                mediaRecorderRef.current.stop();
            }

            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1
                }
            });

            audioStreamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm"
            });

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            // --------------------------------
            // Audio analyser for silence detection
            // --------------------------------

            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();

            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.8;

            analyserRef.current = analyser;

            const source =
                audioContext.createMediaStreamSource(stream);

            source.connect(analyser);

            const dataArray = new Uint8Array(
                analyser.frequencyBinCount
            );

            // Reset recording state
            hasSpeechStartedRef.current = false;
            recordingStartTimeRef.current = Date.now();

            const SPEECH_THRESHOLD = 0.025;
            const SILENCE_DURATION = 2000;  // 2 seconds of silence to stop recording
            const MIN_SPEECH_DURATION = 300;

            // --------------------------------
            // Collect audio
            // --------------------------------

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            // --------------------------------
            // Recording finished
            // --------------------------------

            mediaRecorder.onstop = async () => {
                try {
                    setIsListening(false);

                    // Stop microphone
                    stream.getTracks().forEach((track) => {
                        track.stop();
                    });

                    audioStreamRef.current = null;

                    // Stop analyser
                    if (silenceCheckRef.current) {
                        cancelAnimationFrame(
                            silenceCheckRef.current
                        );

                        silenceCheckRef.current = null;
                    }

                    if (silenceTimerRef.current) {
                        clearTimeout(
                            silenceTimerRef.current
                        );

                        silenceTimerRef.current = null;
                    }

                    if (audioContextRef.current) {
                        await audioContextRef.current.close();

                        audioContextRef.current = null;
                    }

                    mediaRecorderRef.current = null;

                    // --------------------------------
                    // Create audio blob
                    // --------------------------------

                    const audioBlob = new Blob(
                        audioChunksRef.current,
                        {
                            type:
                                mediaRecorder.mimeType ||
                                "audio/webm"
                        }
                    );

                    audioChunksRef.current = [];

                    console.log(
                        "Recorded audio size:",
                        audioBlob.size
                    );

                    // Ignore empty recordings
                    if (audioBlob.size < 1000) {
                        console.log(
                            "Recording too short. Ignoring."
                        );

                        return;
                    }

                    // --------------------------------
                    // Send to Whisper
                    // --------------------------------

                    setIsAiSpeaking(true);

                    const result = await transcribeAudio(
                        audioBlob,
                        languageCode
                    );

                    if (!result?.success) {
                        throw new Error(
                            result?.message ||
                            "Speech recognition failed"
                        );
                    }

                    const transcript =
                        result.text?.trim();

                    console.log(
                        "Whisper transcript:",
                        transcript
                    );

                    if (!transcript) {
                        console.log(
                            "No speech detected."
                        );

                        return;
                    }

                    // --------------------------------
                    // Send transcript to AI
                    // --------------------------------



                    await ensureConversation();
                    await persistMessage("user", transcript);

                    const reply = await sendMessage(transcript, {
                        waitForDisplay: true
                    });


                    if (reply) {
                        await persistMessage("assistant", reply);

                        // Display the AI response once.
                        addAssistantMessage(reply);

                        // Play the audio once.
                        await speakAIResponse(reply);
                    }



                } catch (error) {
                    console.error("Speech-to-text error:", error);
                    console.error("STT response:", error.response?.data);
                    console.error("STT status:", error.response?.status);
                    console.error("STT URL:", error.config?.url);
                } finally {
                    setIsAiSpeaking(false);
                }
            };

            // --------------------------------
            // Start recording
            // --------------------------------

            mediaRecorder.start();

            setIsListening(true);

            console.log("Recording started");

            // --------------------------------
            // Monitor microphone volume
            // --------------------------------

            const checkAudioLevel = () => {
                if (
                    !mediaRecorderRef.current ||
                    mediaRecorderRef.current.state !==
                    "recording"
                ) {
                    return;
                }

                analyser.getByteTimeDomainData(
                    dataArray
                );

                let sum = 0;

                for (
                    let i = 0;
                    i < dataArray.length;
                    i++
                ) {
                    const normalized =
                        (dataArray[i] - 128) / 128;

                    sum += normalized * normalized;
                }

                const rms = Math.sqrt(
                    sum / dataArray.length
                );

                // --------------------------------
                // Speech detected
                // --------------------------------

                if (rms > SPEECH_THRESHOLD) {
                    hasSpeechStartedRef.current = true;

                    // User started speaking again,
                    // cancel pending silence timer.

                    if (silenceTimerRef.current) {
                        clearTimeout(
                            silenceTimerRef.current
                        );

                        silenceTimerRef.current = null;
                    }
                }

                // --------------------------------
                // Silence detected
                // --------------------------------

                else if (
                    hasSpeechStartedRef.current &&
                    !silenceTimerRef.current
                ) {
                    const recordingDuration =
                        Date.now() -
                        recordingStartTimeRef.current;

                    // Don't stop during the first
                    // few milliseconds of recording.

                    if (
                        recordingDuration >=
                        MIN_SPEECH_DURATION
                    ) {
                        silenceTimerRef.current =
                            setTimeout(() => {
                                console.log(
                                    "Silence detected. Stopping recording."
                                );

                                if (
                                    mediaRecorderRef.current &&
                                    mediaRecorderRef.current
                                        .state ===
                                    "recording"
                                ) {
                                    mediaRecorderRef.current.stop();
                                }

                                silenceTimerRef.current =
                                    null;
                            }, SILENCE_DURATION);
                    }
                }

                silenceCheckRef.current =
                    requestAnimationFrame(
                        checkAudioLevel
                    );
            };

            checkAudioLevel();

        } catch (error) {
            console.error(
                "Microphone error:",
                error
            );

            setIsListening(false);

            if (error.name === "NotAllowedError") {
                console.error(
                    "Microphone permission was denied."
                );
            }
        }
    };
    /*
     * End conversation.
     */

    const endConversation = async () => {
        if (isListening || isAiSpeaking || loading) {
            setReportError(
                "Please finish the current recording or response before ending the conversation."
            );
            return;
        }

        setReportLoading(true);
        setReportError("");
        setPerformanceReport(null);

        try {
            const conversationId = await ensureConversation();
            const response = await endConversationAPI(conversationId);

            if (!response?.success || !response?.data?.performance) {
                throw new Error(
                    response?.message || "Unable to generate performance report."
                );
            }

            setPerformanceReport(response.data.performance);
            setConversationEnded(true);
        } catch (error) {
            console.error("Performance report error:", error);

            setReportError(
                error.response?.data?.message ||
                error.message ||
                "Unable to generate your performance report."
            );

            setConversationEnded(true);
        } finally {
            setReportLoading(false);
        }
    };


    /*
     * Start a new conversation.
     */
    const startAgain = () => {
        clearConversation();

        conversationIdRef.current = null;

        setPerformanceReport(null);
        setReportError("");
        setReportLoading(false);

        setConversationEnded(false);
        setIsListening(false);
        setIsAiSpeaking(false);

        hasStartedConversationRef.current = false;

        setInput("");

        // Trigger the greeting effect for a fresh session.
        setConversationRun((previous) => previous + 1);
    };
    const goToHome = () => {
        window.location.href = "/";
    }

    const speakAIResponse = async (
        text,
        speechLanguage = languageCode
    ) => {
        if (!text?.trim()) return;

        const startTime = performance.now();

        try {
            setIsAiSpeaking(true);

            const audioBlob = await synthesizeSpeech(
                text,
                speechLanguage
            );

            console.log(
                `[TTS] Audio generated in ${(performance.now() - startTime).toFixed(0)
                } ms`
            );

            if (!audioBlob || audioBlob.size === 0) {
                throw new Error("TTS returned empty audio");
            }

            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            try {
                await audio.play();

                await new Promise((resolve, reject) => {
                    audio.onended = resolve;
                    audio.onerror = () =>
                        reject(new Error("Audio playback failed"));
                });
            } finally {
                URL.revokeObjectURL(audioUrl);
            }
        } catch (error) {
            console.error("TTS error:", error);
        }
    };


    /*
     * Conversation completed.
     */


    if (reportLoading) {
        return (
            <FullScreenLoader
                message="Analyzing Your Conversation"
                subtitle="VOCO is evaluating your grammar, vocabulary, fluency, and conversation quality. Your personalized feedback will be ready shortly."
            />
        );
    }


    if (conversationEnded) {
        return (
            <div className="ai-learning-page">
                <div className="ai-learning-page__container">

                    <div className="ai-learning-page__score-card">

                        <div className="ai-learning-page__score-header">

                            <span className="ai-learning-page__score-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 3l2.8 5.7L21 9.6l-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                                </svg>
                            </span>

                            <h1>Conversation Complete</h1>

                            <p>
                                Here is your performance from this
                                conversation.
                            </p>

                        </div>

                        <div className="ai-learning-page__overall-score">

                            <div className="ai-learning-page__score-circle">
                                <span>
                                    {performanceReport?.overallScore ?? "--"}
                                </span>
                                <small>/ 100</small>
                            </div>


                            <div className="ai-learning-page__score-content">
                                <h2>
                                    {reportLoading
                                        ? "Analyzing Your Conversation..."
                                        : "Your Performance"}
                                </h2>

                                <p>
                                    {reportLoading
                                        ? "VOCO is evaluating your conversation. This may take a little while."
                                        : reportError
                                            ? reportError
                                            : performanceReport?.feedback ||
                                            "No feedback is available."}
                                </p>
                            </div>


                        </div>


                        <div className="ai-learning-page__metrics">
                            <ScoreItem
                                title="Grammar"
                                score={performanceReport?.grammarScore ?? 0}
                                description="Grammar and sentence construction"
                            />

                            <ScoreItem
                                title="Vocabulary"
                                score={performanceReport?.vocabularyScore ?? 0}
                                description="Word choice and vocabulary range"
                            />

                            <ScoreItem
                                title="Fluency"
                                score={performanceReport?.fluencyScore ?? 0}
                                description="Written-response coherence"
                            />

                            <ScoreItem
                                title="Conversation Quality"
                                score={performanceReport?.conversationQualityScore ?? 0}
                                description="Relevance and conversational flow"
                            />
                        </div>


                        <div className="ai-learning-page__feedback">

                            <div className="ai-learning-page__feedback-header">

                                <span>
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12 3a9 9 0 1 0 9 9" />
                                        <path d="M12 7v5l3 2" />
                                    </svg>
                                </span>

                                <h3>AI Feedback</h3>

                            </div>


                            {reportLoading ? (
                                <p>Generating your personalized feedback...</p>
                            ) : performanceReport ? (
                                <div>
                                    <p>{performanceReport.feedback}</p>

                                    <h4>Strengths</h4>
                                    <ul>
                                        {performanceReport.strengths.map((item, index) => (
                                            <li key={`strength-${index}`}>{item}</li>
                                        ))}
                                    </ul>

                                    <h4>Areas to Improve</h4>
                                    <ul>
                                        {performanceReport.improvements.map((item, index) => (
                                            <li key={`improvement-${index}`}>{item}</li>
                                        ))}
                                    </ul>

                                    <h4>Words to Practice</h4>
                                    <ul>
                                        {performanceReport.practiceWords.map((item, index) => (
                                            <li key={`word-${index}`}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p>{reportError || "No performance report is available."}</p>
                            )}


                        </div>

                        <div className="ai-learning-page__score-actions">

                            <button
                                className="ai-learning-page__primary-button"
                                onClick={startAgain}
                            >
                                Practice Again
                            </button>

                            <button
                                className="ai-learning-page__secondary-button"
                                onClick={goToHome}
                            >
                                Home
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        );
    }

    /*
     * Main conversation page.
     */
    return (
        <div className="ai-learning-page">

            <div className="ai-learning-page__container">

                {/* Header */}
                <header className="ai-learning-page__header">

                    <div>

                        <span className="ai-learning-page__eyebrow">
                            AI SPEAKING PRACTICE
                        </span>

                        <h1>
                            Let's have a conversation
                        </h1>

                        <p>
                            Practice {languageName} naturally with
                            your AI conversation partner.
                        </p>

                    </div>

                    <div className="ai-learning-page__session-status">

                        <span className="ai-learning-page__status-dot" />

                        Live Session

                    </div>

                </header>

                {/* Conversation */}
                <main className="ai-learning-page__conversation-card">

                    {/* AI */}
                    <div className="ai-learning-page__ai-section">

                        <div
                            className={`ai-learning-page__ai-avatar ${isAiSpeaking
                                ? "ai-learning-page__ai-avatar--speaking"
                                : ""
                                }`}
                        >

                            <div className="ai-learning-page__avatar-face">

                                <span className="ai-learning-page__eye" />

                                <span className="ai-learning-page__eye" />

                                <span className="ai-learning-page__mouth" />

                            </div>

                        </div>

                        <div className="ai-learning-page__ai-info">

                            <span className="ai-learning-page__ai-name">
                                AI Conversation Partner
                            </span>

                            <span className="ai-learning-page__ai-status">

                                {isAiSpeaking
                                    ? "Speaking..."
                                    : loading
                                        ? "Thinking..."
                                        : "Ready to listen"}

                            </span>

                        </div>

                    </div>

                    {/* AI message */}
                    <div className="ai-learning-page__question">

                        <span className="ai-learning-page__question-label">
                            AI says
                        </span>

                        <p>
                            {latestAIMessage}
                        </p>

                    </div>

                    {/* User message */}
                    {latestUserMessage && (
                        <div className="ai-learning-page__question">

                            <span className="ai-learning-page__question-label">
                                You said
                            </span>

                            <p>
                                {latestUserMessage}
                            </p>

                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="ai-learning-page__question">

                            <span className="ai-learning-page__question-label">
                                Error
                            </span>

                            <p>
                                {error}
                            </p>

                        </div>
                    )}

                    {/* Voice area */}
                    <div className="ai-learning-page__voice-area">

                        {isListening && (
                            <div className="ai-learning-page__voice-status">

                                <span className="ai-learning-page__voice-wave">

                                    <i />
                                    <i />
                                    <i />
                                    <i />
                                    <i />

                                </span>

                                <span>
                                    Listening to you...
                                </span>

                            </div>
                        )}

                        {!isListening && (
                            <span className="ai-learning-page__voice-hint">
                                Press the microphone and start speaking
                            </span>
                        )}

                        {/* Microphone */}
                        <button
                            className={`ai-learning-page__microphone ${isListening
                                ? "ai-learning-page__microphone--active"
                                : ""
                                }`}
                            onClick={toggleListening}
                            aria-label="Start speaking"
                            disabled={
                                loading ||
                                isAiSpeaking
                            }
                        >

                            <svg viewBox="0 0 24 24">

                                <rect
                                    x="9"
                                    y="2"
                                    width="6"
                                    height="12"
                                    rx="3"
                                />

                                <path d="M5 11a7 7 0 0 0 14 0" />

                                <path d="M12 18v4" />

                                <path d="M8 22h8" />

                            </svg>

                        </button>

                        <span className="ai-learning-page__microphone-label">

                            {isListening
                                ? "Stop speaking"
                                : "Click to speak"}

                        </span>

                    </div>

                    {/* Temporary text testing */}
                    <form
                        onSubmit={handleSendMessage}
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginTop: "20px"
                        }}
                    >

                        <input
                            type="text"
                            value={input}
                            onChange={(event) =>
                                setInput(event.target.value)
                            }
                            placeholder={
                                languageCode === "hi"
                                    ? "हिंदी में लिखें..."
                                    : "Type your response..."
                            }
                            disabled={
                                loading ||
                                isAiSpeaking
                            }
                            style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #ccc"
                            }}
                        />


                        <button
                            type="submit"
                            disabled={
                                loading ||
                                isAiSpeaking ||
                                !input.trim()
                            }
                            aria-label="Send message"
                            title="Send message"
                            className="ai-learning-page__send-button"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M22 2 11 13" />
                                <path d="m22 2-7 20-4-9-9-4Z" />
                            </svg>
                        </button>


                    </form>

                    {/* Controls */}
                    <div className="ai-learning-page__controls">

                        <div className="ai-learning-page__conversation-tip">

                            <svg viewBox="0 0 24 24">

                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                />

                                <path d="M12 10v6" />

                                <path d="M12 7h.01" />

                            </svg>

                            <span>
                                Speak naturally. There is no need
                                to rush.
                            </span>

                        </div>

                        <button
                            className="ai-learning-page__end-button"
                            onClick={endConversation}
                            disabled={reportLoading || loading || isAiSpeaking || isListening}
                        >
                            End Conversation
                        </button>

                    </div>

                </main>

                {/* Session info */}
                <div className="ai-learning-page__session-info">

                    <div>
                        <span>Conversation</span>
                        <strong>Speaking Practice</strong>
                    </div>

                    <div>
                        <span>Language</span>
                        <strong>{languageName}</strong>
                    </div>

                    <div>
                        <span>Mode</span>
                        <strong>AI Conversation</strong>
                    </div>

                </div>

            </div>

        </div>
    );
}

function ScoreItem({
    title,
    score,
    description
}) {
    return (
        <div className="ai-learning-page__metric">

            <div className="ai-learning-page__metric-top">

                <div>

                    <h3>{title}</h3>

                    <span>{description}</span>

                </div>

                <strong>
                    {score}%
                </strong>

            </div>

            <div className="ai-learning-page__progress">

                <span
                    style={{
                        width: `${score}%`
                    }}
                />

            </div>

        </div>
    );
}