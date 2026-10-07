import React, { useState, useRef } from "react";
import usePageTitle from "../hooks/usePageTitle";

export default function AiBasedLearning() {
    const [isListening, setIsListening] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [conversationEnded, setConversationEnded] = useState(false);

    usePageTitle("AI-Based Learning");
    
  const [transcript, setTranscript] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState("");

  const [conversationStarted, setConversationStarted] = useState(false);
  const [language, setLanguage] = useState("");

  // ---------------------------------------------------------
  // REFERENCES
  // ---------------------------------------------------------

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Conversation history for Ollama
  const conversationHistoryRef = useRef([]);

  // Prevent multiple automatic listening calls
  const isProcessingTurnRef = useRef(false);

  // ---------------------------------------------------------
  // SETTINGS
  // ---------------------------------------------------------

  const SILENCE_THRESHOLD = 0.015;
  const SILENCE_DURATION = 1200;

  // ---------------------------------------------------------
  // START CONVERSATION
  // ---------------------------------------------------------

  const startConversation = async () => {
    try {
      setConversationEnded(false);
      setConversationStarted(true);
      setError("");
      setTranscript("");
      setAiMessage("");

      conversationHistoryRef.current = [];

      const greeting =
        "Hello! Welcome to voco. Which language would you like to practice?";

      setAiMessage(greeting);

      setIsAiSpeaking(true);

      await speakAI(greeting);

      setIsAiSpeaking(false);

      if (!conversationEnded) {
        await startListening();
      }
    } catch (err) {
      console.error("Conversation start error:", err);

      setError("Could not start the conversation.");
      setIsAiSpeaking(false);
    }
  };

  // ---------------------------------------------------------
  // AI VOICE
  // Temporary browser TTS.
  // Later we will replace this with local TTS.
  // ---------------------------------------------------------

  const speakAI = (text) => {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        console.warn("Speech synthesis is not supported.");
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = () => {
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  // ---------------------------------------------------------
  // START LISTENING
  // ---------------------------------------------------------

  const startListening = async () => {
    if (conversationEnded || isProcessingTurnRef.current) {
      return;
    }

    try {
      setError("");
      setTranscript("");
      setIsListening(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        stopSilenceDetection();

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        setIsListening(false);

        if (audioBlob.size > 0) {
          await processUserTurn(audioBlob);
        }
      };

      mediaRecorder.start();

      startSilenceDetection(stream);
    } catch (err) {
      console.error("Microphone error:", err);

      setIsListening(false);

      setError(
        "Microphone permission is required. Please allow microphone access."
      );
    }
  };

  // ---------------------------------------------------------
  // SILENCE DETECTION
  // ---------------------------------------------------------

  const startSilenceDetection = (stream) => {
    try {
      const AudioContext =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContext) {
        console.warn("Web Audio API is not supported.");
        return;
      }

      const audioContext = new AudioContext();

      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 2048;

      const microphone =
        audioContext.createMediaStreamSource(stream);

      microphone.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.fftSize);

      let silenceStartedAt = null;
      let hasDetectedSpeech = false;

      const detect = () => {
        if (!analyserRef.current) {
          return;
        }

        analyser.getByteTimeDomainData(dataArray);

        let sum = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const normalized =
            (dataArray[i] - 128) / 128;

          sum += normalized * normalized;
        }

        const volume = Math.sqrt(
          sum / dataArray.length
        );

        // User is speaking
        if (volume > SILENCE_THRESHOLD) {
          hasDetectedSpeech = true;
          silenceStartedAt = null;
        }

        // User stopped speaking
        if (
          hasDetectedSpeech &&
          volume <= SILENCE_THRESHOLD
        ) {
          if (!silenceStartedAt) {
            silenceStartedAt = Date.now();
          }

          const silenceDuration =
            Date.now() - silenceStartedAt;

          if (
            silenceDuration >= SILENCE_DURATION
          ) {
            stopListening();
            return;
          }
        }

        animationFrameRef.current =
          requestAnimationFrame(detect);
      };

      detect();
    } catch (err) {
      console.error(
        "Silence detection error:",
        err
      );
    }
  };

  // ---------------------------------------------------------
  // STOP LISTENING
  // ---------------------------------------------------------

  const stopListening = () => {
    stopSilenceDetection();

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
        "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  // ---------------------------------------------------------
  // STOP SILENCE DETECTION
  // ---------------------------------------------------------

  const stopSilenceDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(
        animationFrameRef.current
      );

      animationFrameRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current
        .close()
        .catch(() => {});

      audioContextRef.current = null;
    }

    analyserRef.current = null;
  };

  // ---------------------------------------------------------
  // PROCESS ONE COMPLETE USER TURN
  // ---------------------------------------------------------

  const processUserTurn = async (audioBlob) => {
    if (isProcessingTurnRef.current) {
      return;
    }

    isProcessingTurnRef.current = true;

    try {
      // ---------------------------------------------
      // STEP 1: WHISPER
      // ---------------------------------------------

      setIsTranscribing(true);
      setError("");

      const formData = new FormData();

      formData.append(
        "file",
        audioBlob,
        "voco-recording.webm"
      );

      const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL;

      const transcriptionResponse = await fetch(
        `${AI_SERVICE_URL}/transcribe`,
        {
          method: "POST",
          body: formData,
        },
      );

      const transcriptionData =
        await transcriptionResponse.json();

      if (!transcriptionResponse.ok) {
        throw new Error(
          JSON.stringify(transcriptionData)
        );
      }

      const userText =
        transcriptionData.text || "";

      console.log(
        "Whisper response:",
        transcriptionData
      );

      setIsTranscribing(false);

      if (!userText.trim()) {
        console.log(
          "No speech detected. Listening again."
        );

        isProcessingTurnRef.current = false;

        setTimeout(() => {
          if (!conversationEnded) {
            startListening();
          }
        }, 300);

        return;
      }

      // Show what user said
      setTranscript(userText);

      // ---------------------------------------------
      // STEP 2: SEND TO OLLAMA
      // ---------------------------------------------

      setIsThinking(true);

      console.log(
        "Sending to conversation API:",
        userText
      );

      const conversationResponse = await fetch(
        `${AI_SERVICE_URL}/conversation`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userText,

            language: language || "English",

            history: conversationHistoryRef.current,
          }),
        },
      );

      const conversationData =
        await conversationResponse.json();

      if (!conversationResponse.ok) {
        throw new Error(
          JSON.stringify(conversationData)
        );
      }

      console.log(
        "Ollama response:",
        conversationData
      );

      // ---------------------------------------------
      // STEP 3: PARSE LLM JSON
      // ---------------------------------------------

      let aiResult;

      try {
        aiResult =
          typeof conversationData.response ===
          "string"
            ? JSON.parse(
                conversationData.response
              )
            : conversationData.response;
      } catch (parseError) {
        console.error(
          "Could not parse LLM response:",
          parseError
        );

        // Fallback if model doesn't return JSON
        aiResult = {
          reply:
            conversationData.response ||
            "I'm sorry, could you say that again?",
          correction_needed: false,
          correction: "",
          next_question: "",
        };
      }

      const aiReply =
        aiResult.reply ||
        "Could you tell me more?";

      // ---------------------------------------------
      // DETECT LANGUAGE
      // ---------------------------------------------

      if (!language && userText.trim()) {
        // The first answer is assumed to be
        // the selected practice language.
        setLanguage(userText.trim());
      }

      // ---------------------------------------------
      // UPDATE CONVERSATION HISTORY
      // ---------------------------------------------

      conversationHistoryRef.current.push({
        role: "user",
        content: userText,
      });

      conversationHistoryRef.current.push({
        role: "assistant",
        content: aiReply,
      });

      console.log(
        "Conversation history:",
        conversationHistoryRef.current
      );

      // ---------------------------------------------
      // DISPLAY AI RESPONSE
      // ---------------------------------------------

      setIsThinking(false);

      setAiMessage(aiReply);

      // ---------------------------------------------
      // STEP 4: AI SPEAKS
      // ---------------------------------------------

      setIsAiSpeaking(true);

      await speakAI(aiReply);

      setIsAiSpeaking(false);

      // ---------------------------------------------
      // STEP 5: LISTEN AGAIN
      // ---------------------------------------------

      isProcessingTurnRef.current = false;

      if (!conversationEnded) {
        setTimeout(() => {
          if (!conversationEnded) {
            startListening();
          }
        }, 300);
      }
    } catch (err) {
      console.error(
        "Conversation processing error:",
        err
      );

      setIsTranscribing(false);
      setIsThinking(false);
      setIsAiSpeaking(false);

      setError(
        err.message ||
          "Could not process your response."
      );

      isProcessingTurnRef.current = false;

      // Continue listening after an error
      setTimeout(() => {
        if (!conversationEnded) {
          startListening();
        }
      }, 1000);
    }
  };

  // ---------------------------------------------------------
  // END CONVERSATION
  // ---------------------------------------------------------

  const endConversation = () => {
    setConversationEnded(true);

    window.speechSynthesis?.cancel();

    stopSilenceDetection();

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
        "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    setIsListening(false);
    setIsAiSpeaking(false);
    setIsThinking(false);
    setIsTranscribing(false);

    isProcessingTurnRef.current = false;
  };

  // ---------------------------------------------------------
  // START AGAIN
  // ---------------------------------------------------------

  const startAgain = () => {
    setConversationEnded(false);
    setConversationStarted(false);

    setIsListening(false);
    setIsAiSpeaking(false);
    setIsThinking(false);
    setIsTranscribing(false);

    setTranscript("");
    setAiMessage("");
    setError("");
    setLanguage("");

    conversationHistoryRef.current = [];

    setTimeout(() => {
      startConversation();
    }, 300);
  };

  // ---------------------------------------------------------
  // SCORE SCREEN
  // ---------------------------------------------------------

  if (conversationEnded) {
    return (
      <div className="ai-learning-page">
        <div className="ai-learning-page .ai-learning-page__score-card">

          <div className="ai-learning-page__score-header">

            <span className="ai-learning-page__score-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 3l2.8 5.7L21 9.6l-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6 9.2 8.7 12 3Z" />
              </svg>
            </span>

            <h1>Conversation Complete</h1>

            <p>
              Here is your performance from
              this conversation.
            </p>

          </div>

          <div className="ai-learning-page__overall-score">

            <div className="ai-learning-page__score-circle">
              <span>86</span>
              <small>/ 100</small>
            </div>

            <div className="ai-learning-page__score-content">

              <h2>Excellent Conversation</h2>

              <p>
                You communicated clearly and
                maintained a good flow throughout
                the conversation.
              </p>

            </div>

          </div>

          <div className="ai-learning-page__metrics">

            <ScoreItem
              title="Fluency"
              score={88}
              description="Good speaking flow"
            />

            <ScoreItem
              title="Grammar"
              score={82}
              description="Minor grammatical mistakes"
            />

            <ScoreItem
              title="Accent"
              score={87}
              description="Clear and understandable"
            />

            <ScoreItem
              title="Vocabulary"
              score={91}
              description="Good word selection"
            />

            <ScoreItem
              title="Pronunciation"
              score={84}
              description="Mostly accurate pronunciation"
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

            <p>
              Your overall communication was
              strong. Try to reduce pauses and
              focus on sentence structure to make
              your speaking more natural.
            </p>

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
              onClick={() =>
                setConversationEnded(false)
              }
            >
              Back to Learning
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN UI
  // ---------------------------------------------------------

  return (
    <div className="ai-learning-page">

      <div className="ai-learning-page__container">

        <header className="ai-learning-page__header">

          <div>

            <span className="ai-learning-page__eyebrow">
              AI SPEAKING PRACTICE
            </span>

            <h1>
              Let's have a conversation
            </h1>

            <p>
              Speak naturally and improve your
              communication skills with your AI
              conversation partner.
            </p>

          </div>

          <div className="ai-learning-page__session-status">

            <span className="ai-learning-page__status-dot"></span>

            {conversationStarted
              ? "Live Session"
              : "Ready"}

          </div>

        </header>

        <main className="ai-learning-page__conversation-card">

          {/* AI SECTION */}

          <div className="ai-learning-page__ai-section">

            <div
              className={`ai-learning-page__ai-avatar ${
                isAiSpeaking
                  ? "ai-learning-page__ai-avatar--speaking"
                  : ""
              }`}
            >

              <div className="ai-learning-page__avatar-face">

                <span className="ai-learning-page__eye"></span>

                <span className="ai-learning-page__eye"></span>

                <span className="ai-learning-page__mouth"></span>

              </div>

            </div>

            <div className="ai-learning-page__ai-info">

              <span className="ai-learning-page__ai-name">
                AI Conversation Partner
              </span>

              <span className="ai-learning-page__ai-status">

                {isAiSpeaking
                  ? "Speaking..."
                  : isThinking
                  ? "Thinking..."
                  : isTranscribing
                  ? "Understanding..."
                  : isListening
                  ? "Listening..."
                  : "Ready"}

              </span>

            </div>

          </div>

          {/* AI MESSAGE */}

          <div className="ai-learning-page__question">

            <span className="ai-learning-page__question-label">
              AI says
            </span>

            <p>
              {aiMessage ||
                "Press Start Conversation to begin."}
            </p>

          </div>

          {/* USER TRANSCRIPT */}

          {(transcript || error) && (

            <div className="ai-learning-page__question">

              <span className="ai-learning-page__question-label">
                You said
              </span>

              {error ? (
                <p>{error}</p>
              ) : (
                <p>{transcript}</p>
              )}

            </div>

          )}

          {/* VOICE AREA */}

          <div className="ai-learning-page__voice-area">

            {isListening && (

              <div className="ai-learning-page__voice-status">

                <span className="ai-learning-page__voice-wave">

                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>

                </span>

                <span>
                  Listening to you...
                </span>

              </div>

            )}

            {isTranscribing && (

              <span className="ai-learning-page__voice-hint">
                Converting your speech to text...
              </span>

            )}

            {isThinking && (

              <span className="ai-learning-page__voice-hint">
                AI is thinking...
              </span>

            )}

            {!conversationStarted &&
              !isTranscribing && (

                <span className="ai-learning-page__voice-hint">
                  Start the conversation to begin
                </span>

              )}

            {!conversationStarted && (

              <>
                <button
                  className="ai-learning-page__microphone"
                  onClick={startConversation}
                  aria-label="Start conversation"
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
                  Start Conversation
                </span>
              </>

            )}

            {conversationStarted &&
              isListening && (

                <span className="ai-learning-page__microphone-label">
                  Speak naturally
                </span>

              )}

            {conversationStarted &&
              !isListening &&
              (isThinking || isTranscribing) && (

                <span className="ai-learning-page__microphone-label">
                  Processing...
                </span>

              )}

          </div>

          {/* CONTROLS */}

          <div className="ai-learning-page__controls">

            <div className="ai-learning-page__conversation-tip">

              <svg viewBox="0 0 24 24">

                <circle cx="12" cy="12" r="9" />

                <path d="M12 10v6" />

                <path d="M12 7h.01" />

              </svg>

              <span>
                Speak naturally. VOCO automatically
                detects when you finish speaking.
              </span>

            </div>

            {conversationStarted && (

              <button
                className="ai-learning-page__end-button"
                onClick={endConversation}
              >
                End Conversation
              </button>

            )}

          </div>

        </main>

        <div className="ai-learning-page__session-info">

          <div>
            <span>Conversation</span>
            <strong>Speaking Practice</strong>
          </div>

          <div>
            <span>Mode</span>
            <strong>Voice Only</strong>
          </div>

          <div>
            <span>Typing</span>
            <strong>Disabled</strong>
          </div>

        </div>

      </div>

    </div>
  );
}


// ---------------------------------------------------------
// SCORE ITEM
// ---------------------------------------------------------

function ScoreItem({
  title,
  score,
  description,
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
            width: `${score}%`,
          }}
        ></span>

      </div>

    </div>
  );
}
