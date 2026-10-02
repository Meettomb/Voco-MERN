import React, { useState } from "react";
import usePageTitle from '../hooks/usePageTitle';

export default function AiBasedLearning() {
    const [isListening, setIsListening] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [conversationEnded, setConversationEnded] = useState(false);
    
    usePageTitle("AI-Based Learning");

    const toggleListening = () => {
        setIsListening((prev) => !prev);
        setIsAiSpeaking(false);
    };

    const endConversation = () => {
        setIsListening(false);
        setIsAiSpeaking(false);
        setConversationEnded(true);
    };

    const startAgain = () => {
        setConversationEnded(false);
        setIsListening(false);
        setIsAiSpeaking(false);
    };

    if (conversationEnded) {
        return (
            <div className="ai-learning-page">
                <div className="ai-learning-page .ai-learning-page__score-card">

                    <div className="ai-learning-page__score-header">
                        <span className="ai-learning-page__score-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 3l2.8 5.7L21 9.6l-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                            </svg>
                        </span>

                        <h1>Conversation Complete</h1>

                        <p>
                            Here is your performance from this conversation.
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
                                You communicated clearly and maintained a good flow
                                throughout the conversation.
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
                            Your overall communication was strong. Try to reduce
                            pauses and focus on sentence structure to make your
                            speaking more natural.
                        </p>

                    </div>

                    <div className="ai-learning-page__score-actions">

                        <button
                            className="ai-learning-page__primary-button"
                            onClick={startAgain}
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
                                <path d="M4 4v5h5" />
                                <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
                                <path d="M20 20v-5h-5" />
                            </svg>

                            Practice Again
                        </button>

                        <button
                            className="ai-learning-page__secondary-button"
                            onClick={() => setConversationEnded(false)}
                        >
                            Back to Learning
                        </button>

                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="ai-learning-page">

            <div className="ai-learning-page__container">

                {/* Header */}
                <header className="ai-learning-page__header">

                    <div>
                        <span className="ai-learning-page__eyebrow">
                            AI SPEAKING PRACTICE
                        </span>

                        <h1>Let's have a conversation</h1>

                        <p>
                            Speak naturally and improve your communication skills
                            with your AI conversation partner.
                        </p>
                    </div>

                    <div className="ai-learning-page__session-status">
                        <span className="ai-learning-page__status-dot"></span>
                        Live Session
                    </div>

                </header>


                {/* Main Conversation Card */}
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
                                    : "Ready to listen"}
                            </span>

                        </div>

                    </div>


                    {/* AI Message */}
                    <div className="ai-learning-page__question">

                        <span className="ai-learning-page__question-label">
                            AI says
                        </span>

                        <p>
                            Tell me about something interesting you did recently.
                        </p>

                    </div>


                    {/* Voice Status */}
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

                                <span>Listening to you...</span>

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
                            {isListening ? "Stop speaking" : "Click to speak"}
                        </span>

                    </div>


                    {/* Bottom Controls */}
                    <div className="ai-learning-page__controls">

                        <div className="ai-learning-page__conversation-tip">

                            <svg viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 10v6" />
                                <path d="M12 7h.01" />
                            </svg>

                            <span>
                                Speak naturally. There is no need to rush.
                            </span>

                        </div>

                        <button
                            className="ai-learning-page__end-button"
                            onClick={endConversation}
                        >

                            <svg viewBox="0 0 24 24">
                                <path
                                    d="M6.6 10.8c1.4 2.7 3.9 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2
    1 .3 2 .5 3 .5.6 0 1 .4 1 1V20c0 .6-.4 1-1 1
    C10.4 21 3 13.6 3 4.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1
    0 1 .2 2 .5 3 .1.4 0 .8-.2 1.1l-2.2 2.2Z"
                                />
                            </svg>

                            End Conversation

                        </button>

                    </div>

                </main>


                {/* Session Stats */}
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


function ScoreItem({ title, score, description }) {
    return (
        <div className="ai-learning-page__metric">

            <div className="ai-learning-page__metric-top">

                <div>
                    <h3>{title}</h3>
                    <span>{description}</span>
                </div>

                <strong>{score}%</strong>

            </div>

            <div className="ai-learning-page__progress">
                <span
                    style={{
                        width: `${score}%`
                    }}
                ></span>
            </div>

        </div>
    );
}