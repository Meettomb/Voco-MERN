import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleConversation } from "../../../services/aiService";

export default function SingleConversation() {
    const { conversationId } = useParams();
    const navigate = useNavigate();

    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Inline SVG icons.
    const SvgIcon = ({
        name,
        size = 18,
        strokeWidth = 1.8,
        className = "",
    }) => {
        const common = {
            width: size,
            height: size,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className,
            "aria-hidden": true,
            focusable: "false",
        };

        const paths = {
            back: (
                <>
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                </>
            ),
            language: (
                <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18" />
                    <path d="M12 3a15 15 0 0 1 0 18" />
                    <path d="M12 3a15 15 0 0 0 0 18" />
                </>
            ),
            clock: (
                <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </>
            ),
            calendar: (
                <>
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 10h18" />
                </>
            ),
            vocabulary: (
                <>
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" />
                    <path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20" />
                    <path d="M8 7h8M8 10h6" />
                </>
            ),
            grammar: (
                <>
                    <path d="m5 12 4 4L19 6" />
                    <circle cx="12" cy="12" r="9" />
                </>
            ),
            fluency: (
                <>
                    <path d="M3 17 9 11l4 4 8-9" />
                    <path d="M15 6h6v6" />
                </>
            ),
            pronunciation: (
                <>
                    <path d="M12 3v18" />
                    <path d="M8 7v10M4 10v4M16 7v10M20 10v4" />
                </>
            ),
            comprehension: (
                <>
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="12" cy="12" r="1" />
                </>
            ),
            sparkle: (
                <>
                    <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
                    <path d="m19 15 1 2.5 2 1-2 1-1 2.5-1-2.5-2-1 2-1 1-2.5Z" />
                </>
            ),
            check: <path d="m5 12 4 4L19 6" />,
            improve: (
                <>
                    <path d="M4 17 10 11l4 4 6-8" />
                    <path d="M14 7h6v6" />
                </>
            ),
            user: (
                <>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                </>
            ),
            bot: (
                <>
                    <rect x="4" y="7" width="16" height="13" rx="3" />
                    <path d="M12 3v4M9 12h.01M15 12h.01M9 16h6" />
                    <path d="M2 12v3M22 12v3" />
                </>
            ),
            message: (
                <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-4.6a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 4H13a8.5 8.5 0 0 1 8 7.5Z" />
            ),
            alert: (
                <>
                    <path d="M12 3 2.8 20h18.4L12 3Z" />
                    <path d="M12 9v4M12 17h.01" />
                </>
            ),
            return: (
                <>
                    <path d="M9 14 4 9l5-5" />
                    <path d="M4 9h10a6 6 0 0 1 0 12h-2" />
                </>
            ),
            edit: (
                <>
                    <path d="m16 4 4 4" />
                    <path d="M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" />
                </>
            ),
            chart: (
                <>
                    <path d="M3 3v18h18" />
                    <path d="m7 14 4-4 4 3 5-7" />
                </>
            ),
            microphone: (
                <>
                    <rect x="9" y="3" width="6" height="12" rx="3" />
                    <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
                </>
            ),
            keyboard: (
                <>
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 15h8" />
                </>
            ),
        };

        return <svg {...common}>{paths[name] || paths.message}</svg>;
    };

    const scoreLabels = [
        {
            key: "grammarScore",
            label: "Grammar",
            icon: "grammar",
            color: "green",
            description: "Grammar and sentence construction",
        },
        {
            key: "vocabularyScore",
            label: "Vocabulary",
            icon: "vocabulary",
            color: "blue",
            description: "Word choice and vocabulary range",
        },
        {
            key: "fluencyScore",
            label: "Fluency",
            icon: "fluency",
            color: "orange",
            description: "Expression and conversational flow",
        },
        {
            key: "comprehensionScore",
            label: "Comprehension",
            icon: "comprehension",
            color: "yellow",
            description: "Understanding and relevant responses",
        },
        {
            key: "conversationQualityScore",
            label: "Conversation Quality",
            icon: "sparkle",
            color: "purple",
            description: "Relevance and conversational coherence",
        },
        {
            key: "pronunciationScore",
            label: "Pronunciation",
            icon: "pronunciation",
            color: "purple",
            description: "Speech pronunciation assessment",
        },
    ];

    const formatDate = useCallback((date) => {
        if (!date) return "Unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Unavailable";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    }, []);

    const formatMessageTime = useCallback((date) => {
        if (!date) return "";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }, []);

    const formatDuration = useCallback((start, end) => {
        if (!start || !end) return "Unavailable";

        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();

        if (
            !Number.isFinite(startTime) ||
            !Number.isFinite(endTime) ||
            endTime < startTime
        ) {
            return "Unavailable";
        }

        const totalMinutes = Math.floor(
            (endTime - startTime) / 60000
        );

        if (totalMinutes < 1) return "Less than 1 min";

        if (totalMinutes < 60) {
            return `${totalMinutes} min`;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return minutes
            ? `${hours} hr ${minutes} min`
            : `${hours} hr`;
    }, []);

    const getArray = useCallback(
        (value) => (Array.isArray(value) ? value : []),
        []
    );

    const getScore = useCallback((performance, keys) => {
        for (const key of keys) {
            const value = performance?.[key];

            if (
                value !== null &&
                value !== undefined &&
                value !== "" &&
                Number.isFinite(Number(value)) &&
                Number(value) >= 0 &&
                Number(value) <= 100
            ) {
                return Number(value);
            }
        }

        return null;
    }, []);

    const handleBack = useCallback(
        () => navigate(-1),
        [navigate]
    );

    const handleReturnToProfile = useCallback(
        () => navigate("/profile"),
        [navigate]
    );

    useEffect(() => {
        let isActive = true;

        const fetchConversation = async () => {
            if (!conversationId) {
                setConversation(null);
                setError("Conversation ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");
                setConversation(null);

                const response =
                    await getSingleConversation(conversationId);

                if (!response?.success || !response?.data) {
                    throw new Error(
                        "Conversation data was not found."
                    );
                }

                if (isActive) {
                    setConversation(response.data);
                }
            } catch (err) {
                console.error(
                    "Failed to load conversation:",
                    err
                );

                if (isActive) {
                    setError(
                        err.response?.data?.message ||
                            err.message ||
                            "Unable to load conversation."
                    );
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        fetchConversation();

        return () => {
            isActive = false;
        };
    }, [conversationId]);

    const performance = conversation?.performance || {};
    const messages = getArray(conversation?.messages);

    const scores = {
        grammarScore: getScore(performance, [
            "grammarScore",
            "grammar",
        ]),
        vocabularyScore: getScore(performance, [
            "vocabularyScore",
            "vocabulary",
        ]),
        fluencyScore: getScore(performance, [
            "fluencyScore",
            "fluency",
        ]),
        comprehensionScore: getScore(performance, [
            "comprehensionScore",
            "comprehension",
        ]),
        conversationQualityScore: getScore(performance, [
            "conversationQualityScore",
            "conversationQuality",
        ]),
        pronunciationScore: getScore(performance, [
            "pronunciationScore",
            "pronunciation",
        ]),
    };

    const storedOverallScore = getScore(performance, [
        "overallScore",
        "overall",
    ]);

    // Use the saved overall score. Do not average in an unassessed
    // pronunciation score or silently replace the backend calculation.
    const overallScore = storedOverallScore;

    const strengths = getArray(performance.strengths);
    const improvements = getArray(performance.improvements);
    const corrections = getArray(performance.corrections);
    const practiceWords = getArray(performance.practiceWords);

    const learnerMessages = messages.filter(
        (message) => message.role === "user"
    );

    const spokenMessageCount = learnerMessages.filter(
        (message) => message.inputMode === "speech"
    ).length;

    const typedMessageCount = learnerMessages.filter(
        (message) => message.inputMode === "text"
    ).length;

    const interactionMode =
        performance.interactionMode ||
        (spokenMessageCount > 0 && typedMessageCount > 0
            ? "mixed"
            : spokenMessageCount > 0
              ? "speech"
              : typedMessageCount > 0
                ? "text"
                : "unknown");

    const totalLearnerMessages =
        performance.learnerMessageCount ??
        learnerMessages.length;

    const totalSpokenMessages =
        performance.spokenMessageCount ??
        spokenMessageCount;

    const totalTypedMessages =
        performance.typedMessageCount ??
        typedMessageCount;

    const summary =
        performance.feedback ||
        "No personalized feedback is available for this conversation.";

    const language =
        conversation?.language === "hi" ? "Hindi" : "English";

    const statusLabel =
        conversation?.status === "completed"
            ? "Completed"
            : conversation?.status === "analyzing"
              ? "Analyzing"
              : conversation?.status === "active"
                ? "In progress"
                : conversation?.status || "Unknown";

    const ScoreCard = ({
        label,
        score,
        icon,
        color,
        description,
    }) => {
        const validScore =
            typeof score === "number" &&
            Number.isFinite(score) &&
            score >= 0 &&
            score <= 100;

        return (
            <article
                className={`single-conversation__score-card single-conversation__score-card--${color}`}
            >
                <div className="single-conversation__score-top">
                    <span className="single-conversation__score-icon">
                        <SvgIcon name={icon} size={21} />
                    </span>

                    <span className="single-conversation__score-value">
                        {validScore ? `${score}%` : "N/A"}
                    </span>
                </div>

                <div className="single-conversation__score-label">
                    {label}
                </div>

                <p className="single-conversation__score-description">
                    {description}
                </p>

                {validScore ? (
                    <div
                        className="single-conversation__progress-track"
                        role="progressbar"
                        aria-label={label}
                        aria-valuenow={score}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div
                            className="single-conversation__progress-fill"
                            style={{ width: `${score}%` }}
                        />
                    </div>
                ) : (
                    <p className="single-conversation__score-unavailable">
                        Not assessed
                    </p>
                )}
            </article>
        );
    };

    if (loading) {
        return (
            <main className="single-conversation">
                <div className="single-conversation__container">
                    <div className="single-conversation__panel">
                        <div
                            className="single-conversation__spinner"
                            role="status"
                            aria-label="Loading conversation"
                        />
                        <p>Loading conversation details...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !conversation) {
        return (
            <main className="single-conversation">
                <div className="single-conversation__container">
                    <button
                        type="button"
                        className="single-conversation__back-button"
                        onClick={handleBack}
                    >
                        <SvgIcon name="back" />
                        Back to conversations
                    </button>

                    <div className="single-conversation__panel">
                        <h2>Unable to load conversation</h2>
                        <p>
                            {error || "Conversation not found."}
                        </p>

                        <button
                            type="button"
                            className="single-conversation__back-button"
                            onClick={handleReturnToProfile}
                        >
                            <SvgIcon name="return" />
                            Return to profile
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="single-conversation">
            <div className="single-conversation__container">
                {/* Back Navigation */}
                <button
                    className="single-conversation__back-button"
                    onClick={handleBack}
                    type="button"
                >
                    <SvgIcon name="back" />
                    Back to conversations
                </button>

                {/* Page Header */}
                <header className="single-conversation__header">
                    <div className="single-conversation__header-content">
                        <div className="single-conversation__eyebrow">
                            VOCO / Conversation History
                        </div>

                        <h1 className="single-conversation__title">
                            Conversation Details
                        </h1>

                        <p className="single-conversation__subtitle">
                            Review your conversation, explore your
                            performance, and identify areas for improvement.
                        </p>

                        <div className="single-conversation__meta">
                            <span className="single-conversation__status">
                                <span className="single-conversation__status-dot" />
                                {statusLabel}
                            </span>

                            <span className="single-conversation__meta-item">
                                <SvgIcon name="language" size={16} />
                                {language}
                            </span>

                            <span className="single-conversation__meta-item">
                                <SvgIcon name="clock" size={16} />
                                {formatDuration(
                                    conversation.startedAt,
                                    conversation.endedAt
                                )}
                            </span>

                            <span className="single-conversation__meta-item">
                                <SvgIcon name="calendar" size={16} />
                                {formatDate(
                                    conversation.startedAt ||
                                        conversation.createdAt
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="single-conversation__overall">
                        <div className="single-conversation__overall-label">
                            Overall Score
                        </div>

                        <div className="single-conversation__overall-score">
                            {overallScore !== null
                                ? overallScore
                                : "—"}
                            <span>/100</span>
                        </div>

                        <div className="single-conversation__overall-caption">
                            {overallScore !== null
                                ? "Your conversation performance"
                                : "No score available"}
                        </div>
                    </div>
                </header>

                {/* Session Information */}
                <section className="single-conversation__panel single-conversation__session">
                    <div className="single-conversation__section-heading">
                        <div>
                            <h2>Session Information</h2>
                            <p>
                                Details about this learning session.
                            </p>
                        </div>
                    </div>

                    <div className="single-conversation__session-grid">
                        <div className="single-conversation__session-item">
                            <span>Language</span>
                            <strong>{language}</strong>
                        </div>

                        <div className="single-conversation__session-item">
                            <span>Status</span>
                            <strong>{statusLabel}</strong>
                        </div>

                        <div className="single-conversation__session-item">
                            <span>Started At</span>
                            <strong>
                                {formatDate(conversation.startedAt)}
                            </strong>
                        </div>

                        <div className="single-conversation__session-item">
                            <span>Ended At</span>
                            <strong>
                                {formatDate(conversation.endedAt)}
                            </strong>
                        </div>

                        <div className="single-conversation__session-item">
                            <span>Duration</span>
                            <strong>
                                {formatDuration(
                                    conversation.startedAt,
                                    conversation.endedAt
                                )}
                            </strong>
                        </div>

                        <div className="single-conversation__session-item">
                            <span>Total Messages</span>
                            <strong>{messages.length}</strong>
                        </div>
                    </div>
                </section>

                {/* Complete Performance Overview */}
                <section className="single-conversation__scores-section">
                    <div className="single-conversation__section-heading">
                        <div>
                            <h2>Performance Overview</h2>
                            <p>
                                Your results across all language-learning
                                assessment categories.
                            </p>
                        </div>

                        <span className="single-conversation__section-tag">
                            {
                                Object.values(scores).filter(
                                    (score) => score !== null
                                ).length
                            }
                            /6 metrics
                        </span>
                    </div>

                    <div className="single-conversation__scores-grid">
                        {scoreLabels.map((item) => (
                            <ScoreCard
                                key={item.key}
                                label={item.label}
                                icon={item.icon}
                                color={item.color}
                                description={item.description}
                                score={scores[item.key]}
                            />
                        ))}
                    </div>

                    <p className="single-conversation__score-note">
                        Pronunciation requires audio-based assessment.
                        A score is displayed only when the backend provides one.
                    </p>
                </section>

                {/* Conversation Statistics */}
                <section className="single-conversation__panel single-conversation__statistics">
                    <div className="single-conversation__section-heading">
                        <div>
                            <h2>Conversation Statistics</h2>
                            <p>
                                How you interacted with VOCO during this session.
                            </p>
                        </div>
                    </div>

                    <div className="single-conversation__statistics-grid">
                        <div className="single-conversation__stat-card">
                            <span className="single-conversation__stat-icon">
                                <SvgIcon name="message" size={21} />
                            </span>

                            <span className="single-conversation__stat-label">
                                Interaction Mode
                            </span>

                            <strong>
                                {interactionMode === "unknown"
                                    ? "Unavailable"
                                    : interactionMode.charAt(0).toUpperCase() +
                                      interactionMode.slice(1)}
                            </strong>
                        </div>

                        <div className="single-conversation__stat-card">
                            <span className="single-conversation__stat-icon">
                                <SvgIcon name="user" size={21} />
                            </span>

                            <span className="single-conversation__stat-label">
                                Learner Messages
                            </span>

                            <strong>{totalLearnerMessages}</strong>
                        </div>

                        <div className="single-conversation__stat-card">
                            <span className="single-conversation__stat-icon">
                                <SvgIcon name="microphone" size={21} />
                            </span>

                            <span className="single-conversation__stat-label">
                                Spoken Messages
                            </span>

                            <strong>{totalSpokenMessages}</strong>
                        </div>

                        <div className="single-conversation__stat-card">
                            <span className="single-conversation__stat-icon">
                                <SvgIcon name="keyboard" size={21} />
                            </span>

                            <span className="single-conversation__stat-label">
                                Typed Messages
                            </span>

                            <strong>{totalTypedMessages}</strong>
                        </div>
                    </div>
                </section>

                {/* Main Content */}
                <div className="single-conversation__content-grid">
                    {/* Complete Transcript */}
                    <section className="single-conversation__panel single-conversation__transcript">
                        <div className="single-conversation__panel-header">
                            <div>
                                <h2>Conversation Transcript</h2>
                                <p>
                                    All recorded messages in chronological order.
                                </p>
                            </div>

                            <span className="single-conversation__message-count">
                                <SvgIcon name="message" size={15} />
                                {messages.length} messages
                            </span>
                        </div>

                        <div className="single-conversation__messages">
                            {messages.length > 0 ? (
                                messages.map((message, index) => {
                                    const isUser = message.role === "user";

                                    const modeLabel =
                                        message.inputMode === "speech"
                                            ? "Speech"
                                            : message.inputMode === "text"
                                              ? "Text"
                                              : null;

                                    return (
                                        <article
                                            key={message._id || index}
                                            className={`single-conversation__message ${
                                                isUser
                                                    ? "single-conversation__message--user"
                                                    : "single-conversation__message--assistant"
                                            }`}
                                        >
                                            <div
                                                className="single-conversation__avatar"
                                                aria-label={
                                                    isUser ? "User" : "VOCO AI"
                                                }
                                            >
                                                <SvgIcon
                                                    name={
                                                        isUser ? "user" : "bot"
                                                    }
                                                    size={19}
                                                />
                                            </div>

                                            <div className="single-conversation__message-body">
                                                <div className="single-conversation__message-info">
                                                    <span className="single-conversation__message-author">
                                                        {isUser ? "You" : "VOCO AI"}
                                                    </span>

                                                    <time className="single-conversation__message-time">
                                                        {formatMessageTime(
                                                            message.timestamp
                                                        )}
                                                    </time>

                                                    {isUser && modeLabel && (
                                                        <span className="single-conversation__message-mode">
                                                            {modeLabel}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="single-conversation__bubble">
                                                    {message.content}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })
                            ) : (
                                <p>
                                    No messages found in this conversation.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Detailed Report Sidebar */}
                    <aside className="single-conversation__sidebar">
                        {/* AI Feedback */}
                        <section className="single-conversation__panel single-conversation__summary">
                            <div className="single-conversation__panel-title">
                                <span className="single-conversation__title-icon">
                                    <SvgIcon name="sparkle" size={19} />
                                </span>

                                <h2>AI Feedback</h2>
                            </div>

                            <p className="single-conversation__summary-text">
                                {summary}
                            </p>
                        </section>

                        {/* Strengths */}
                        <section className="single-conversation__panel single-conversation__feedback">
                            <div className="single-conversation__panel-title">
                                <span className="single-conversation__feedback-icon single-conversation__feedback-icon--success">
                                    <SvgIcon name="check" size={17} />
                                </span>

                                <h2>Strengths</h2>
                            </div>

                            {strengths.length > 0 ? (
                                <ul className="single-conversation__feedback-list">
                                    {strengths.map((item, index) => (
                                        <li key={index}>
                                            <span className="single-conversation__list-marker">
                                                <SvgIcon name="check" size={14} />
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No strengths recorded.</p>
                            )}
                        </section>

                        {/* Improvements */}
                        <section className="single-conversation__panel single-conversation__feedback">
                            <div className="single-conversation__panel-title">
                                <span className="single-conversation__feedback-icon single-conversation__feedback-icon--improve">
                                    <SvgIcon name="improve" size={17} />
                                </span>

                                <h2>Areas to Improve</h2>
                            </div>

                            {improvements.length > 0 ? (
                                <ul className="single-conversation__feedback-list">
                                    {improvements.map((item, index) => (
                                        <li key={index}>
                                            <span className="single-conversation__list-marker single-conversation__list-marker--improve">
                                                <SvgIcon name="alert" size={14} />
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No improvement suggestions recorded.</p>
                            )}
                        </section>

                        {/* Sentence Corrections */}
                        <section className="single-conversation__panel single-conversation__corrections">
                            <div className="single-conversation__panel-title">
                                <span className="single-conversation__title-icon">
                                    <SvgIcon name="edit" size={19} />
                                </span>

                                <h2>Sentence Corrections</h2>
                            </div>

                            {corrections.length > 0 ? (
                                <div className="single-conversation__correction-list">
                                    {corrections.map((item, index) => (
                                        <article
                                            className="single-conversation__correction-card"
                                            key={index}
                                        >
                                            <div className="single-conversation__correction-heading">
                                                Correction {index + 1}
                                            </div>

                                            <div className="single-conversation__correction-field single-conversation__correction-field--original">
                                                <span>Original Sentence</span>
                                                <p>
                                                    {item.original ||
                                                        "Not available"}
                                                </p>
                                            </div>

                                            <div className="single-conversation__correction-field single-conversation__correction-field--corrected">
                                                <span>Corrected Sentence</span>
                                                <p>
                                                    {item.corrected ||
                                                        "Not available"}
                                                </p>
                                            </div>

                                            <div className="single-conversation__correction-field">
                                                <span>Explanation</span>
                                                <p>
                                                    {item.explanation ||
                                                        "No explanation provided."}
                                                </p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <p>
                                    No sentence corrections were recorded
                                    for this conversation.
                                </p>
                            )}
                        </section>

                        {/* Practice Vocabulary */}
                        <section className="single-conversation__panel single-conversation__vocabulary">
                            <div className="single-conversation__panel-title">
                                <span className="single-conversation__title-icon single-conversation__title-icon--orange">
                                    <SvgIcon name="vocabulary" size={19} />
                                </span>

                                <h2>Words to Practice</h2>
                            </div>

                            <p className="single-conversation__vocabulary-description">
                                Recommended words and phrases to help you
                                improve your language skills.
                            </p>

                            <div className="single-conversation__vocabulary-tags">
                                {practiceWords.map((word, index) => (
                                    <span
                                        className="single-conversation__vocabulary-tag"
                                        key={`${word}-${index}`}
                                    >
                                        {word}
                                    </span>
                                ))}
                            </div>

                            {practiceWords.length === 0 && (
                                <p>
                                    No practice vocabulary was recorded.
                                </p>
                            )}
                        </section>
                    </aside>
                </div>

                {/* Footer */}
                <footer className="single-conversation__footer">
                    <span>VOCO Language Learning</span>
                    <span>
                        Every conversation is a step forward.
                    </span>
                </footer>
            </div>
        </main>
    );
}