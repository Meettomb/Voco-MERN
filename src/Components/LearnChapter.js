/**
 * Performance Optimization: Memoization
 *
 * Creates a Set of completed chapter IDs and reuses it until
 * the completedChapters array changes.
 *
 * Benefits:
 * - Avoids rebuilding the Set on every render.
 * - Provides efficient chapter completion lookups.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import FullScreenLoader from "./FullScreenLoader";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import LearnChapterFacade from "../services/LearnChapterFacade";

export default function LearnChapter() {
    const { userData, activeLanguage, uiLanguage } = useAuth();
    const { chapterId } = useParams();
    const navigate = useNavigate();

    const [completedChapters, setCompletedChapters] = useState([]);
    const [grammarLang, setGrammarLang] = useState(uiLanguage?.code || "en");
    const [chapterData, setChapterData] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(true);
    const [markingComplete, setMarkingComplete] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;
    const learnLang = activeLanguage?.code || "en";
    const baseLang = uiLanguage?.code || "en";
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!chapterId) navigate(-1, { replace: true });
    }, [chapterId, navigate]);

    useEffect(() => {
        if (!message) return undefined;
        const timer = setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 5000);
        return () => clearTimeout(timer);
    }, [message]);

    // Facade + Proxy: load chapter and progress concurrently, using short-lived caches.
    useEffect(() => {
        if (!userData?._id || !chapterId) {
            setLoading(false);
            return undefined;
        }

        const controller = new AbortController();
        let isActive = true;

        const loadChapterPage = async () => {
            setLoading(true);
            setChapterData(null);

            try {
                const result = await LearnChapterFacade.getChapterPageData({
                    chapterId,
                    languageId: activeLanguage?._id,
                    userId: userData._id,
                    token,
                    apiUrl: API_URL,
                    signal: controller.signal,
                });

                if (!isActive) return;

                if (result.chapter) {
                    setChapterData(result.chapter);
                } else {
                    setChapterData(null);
                    setMessage("Chapter not found");
                    setMessageType("error");
                }

                if (result.completedChapters) {
                    setCompletedChapters(result.completedChapters);
                }

                if (result.progressError) {
                    console.error("Error fetching learning progress:", result.progressError);
                }
            } catch (error) {
                if (error.name !== "CanceledError" &&
                    error.code !== "ERR_CANCELED" &&
                    !controller.signal.aborted &&
                    isActive) {
                    console.error("Error fetching chapter:", error);
                    setChapterData(null);
                    setMessage("Error fetching chapter. Please try again.");
                    setMessageType("error");
                }
            } finally {
                if (isActive && !controller.signal.aborted) setLoading(false);
            }
        };

        loadChapterPage();

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [
        userData?._id,
        chapterId,
        activeLanguage?._id,
        token,
        API_URL,
    ]);

    // Memoize the lookup structure so checking completion is fast on re-renders.
    const completedChapterSet = useMemo(
        () => new Set(completedChapters.map((id) => String(id?._id ?? id))),
        [completedChapters]
    );
    const isCompleted = completedChapterSet.has(String(chapterId));

    const getSpeechLang = useCallback((code) => {
        if (!code) return "en-US";
        const map = {
            en: "en-US",
            hi: "hi-IN",
            gu: "gu-IN",
            mr: "mr-IN",
            ta: "ta-IN",
            te: "te-IN",
            bn: "bn-IN",
            es: "es-ES",
            fr: "fr-FR",
            pt: "pt-PT",
            zh: "zh-CN",
        };
        return map[code] || `${code}-${code.toUpperCase()}`;
    }, []);

    const speakText = useCallback((text, langCode) => {
        if (!text || !("speechSynthesis" in window)) return;
        const utterance = new SpeechSynthesisUtterance(String(text));
        utterance.lang = getSpeechLang(langCode);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }, [getSpeechLang]);

    const speakSelectedText = useCallback(() => {
        const selected = window.getSelection()?.toString().trim();
        if (!selected) {
            setMessage("Please select text first");
            setMessageType("error");
            return;
        }
        speakText(selected, grammarLang);
    }, [grammarLang, speakText]);

    const handleMarkComplete = useCallback(async () => {
        if (markingComplete || isCompleted) return;

        setMarkingComplete(true);
        try {
            const result = await LearnChapterFacade.markChapterComplete({
                userId: userData?._id,
                languageId: activeLanguage?._id,
                chapterId,
                token,
                apiUrl: API_URL,
            });

            if (result.status === 1) {
                setCompletedChapters((previous) =>
                    previous.some((id) => String(id?._id ?? id) === String(chapterId))
                        ? previous
                        : [...previous, chapterId]
                );
                setMessage("Chapter marked as completed");
                setMessageType("success");
            } else {
                setMessage(result.message || "Something went wrong");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error marking chapter complete:", error);
            setMessage("Server error. Please try again.");
            setMessageType("error");
        } finally {
            setMarkingComplete(false);
        }
    }, [
        markingComplete,
        isCompleted,
        userData?._id,
        activeLanguage?._id,
        chapterId,
        token,
        API_URL,
    ]);

    if (loading) return <FullScreenLoader />;

    if (!chapterData) {
        return (
            <div className="LearnChapter">
                {message && <p className={`app-message ${messageType}`}>{message}</p>}
                <p>No Data</p>
                <button className="LearnChapter__backBtn" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }

    const { contentType, grammarContent, difficulties } = chapterData;



    return (

        <>

            {message && (

                <p className={`app-message ${messageType}`}>

                    {message}

                </p>

            )}



            <div className="LearnChapter">

                <div className="LearnChapter__container">



                    <div className="LearnChapter__header">

                        <button

                            className="LearnChapter__backBtn"

                            onClick={() => navigate(-1)}

                        >

                            <svg

                                xmlns="http://www\.w3.org/2000/svg"

                                className="LearnChapter__backIcon"

                                fill="none"

                                viewBox="0 0 24 24"

                                stroke="currentColor"

                                strokeWidth={2}

                            >

                                <path

                                    strokeLinecap="round"

                                    strokeLinejoin="round"

                                    d="M15 19l-7-7 7-7"

                                />

                            </svg>



                            <span>Back</span>

                        </button>

                    </div>





                    {/* TEXT AREA */}

                    {contentType === "TextArea" && (

                        <>



                            <div className="LearnChapter__langToggle">



                                <button

                                    className={grammarLang === uiLanguage?.code ? "active" : ""}

                                    onClick={() => setGrammarLang(uiLanguage?.code)}

                                >

                                    {uiLanguage?.code?.toUpperCase()}

                                </button>



                                <button

                                    className={grammarLang === activeLanguage?.code ? "active" : ""}

                                    onClick={() => setGrammarLang(activeLanguage?.code)}

                                >

                                    {activeLanguage?.code?.toUpperCase()}

                                </button>



                            </div>

                            <button

                                className="LearnChapter__speakSelectedBtn"

                                onClick={speakSelectedText}

                            >

                                <svg

                                    xmlns="http://www\.w3.org/2000/svg"

                                    viewBox="0 0 24 24"

                                    fill="currentColor"

                                    className="LearnChapter__speakIcon"

                                >

                                    <path d="M11 5L6 9H3v6h3l5 4V5z" />

                                    <path d="M15.5 8.5a5 5 0 010 7" fill="none" stroke="currentColor" strokeWidth="2" />

                                    <path d="M17.5 6a8 8 0 010 12" fill="none" stroke="currentColor" strokeWidth="2" />

                                </svg>



                                Speak Selected

                            </button>

                            <div className="LearnChapter__grammar">

                                <div

                                    className="LearnChapter__grammarContent"

                                    dangerouslySetInnerHTML={{

                                        __html:

                                            grammarContent?.[grammarLang] ||

                                            grammarContent?.["en"] ||

                                            "",

                                    }}

                                />

                            </div>

                        </>

                    )}



                    {/* TEXT BLOCK */}

                    {contentType === "TextBlock" && (

                        <div className="LearnChapter__levels">

                            {difficulties?.map((level, index) => (

                                <div className="LearnChapter__level" key={index}>



                                    <div className="LearnChapter__levelHeader">

                                        {level.level.toUpperCase()}

                                    </div>



                                    <div className="LearnChapter__words">

                                        {level.words.map((word, i) => (

                                            <div className="LearnChapter__wordCard" key={i}>



                                                <div className="LearnChapter__wordRow">

                                                    <span>{word[baseLang]}</span>



                                                    <button

                                                        className="LearnChapter__speakBtn"

                                                        onClick={() => speakText(word[baseLang], baseLang)}

                                                    >

                                                        <svg

                                                            className="LearnChapter__speakIcon"

                                                            xmlns="http://www\.w3.org/2000/svg"

                                                            viewBox="0 0 24 24"

                                                            fill="currentColor"

                                                        >

                                                            <path d="M11 5L6 9H3v6h3l5 4V5z" />

                                                            <path d="M15.5 8.5a5 5 0 010 7" fill="none" stroke="currentColor" strokeWidth="2" />

                                                            <path d="M17.5 6a8 8 0 010 12" fill="none" stroke="currentColor" strokeWidth="2" />

                                                        </svg>

                                                    </button>

                                                </div>



                                                <div className="LearnChapter__wordRow">

                                                    <span>{word[learnLang]}</span>



                                                    <button

                                                        className="LearnChapter__speakBtn"

                                                        onClick={() => speakText(word[learnLang], learnLang)}

                                                    >

                                                        <svg

                                                            className="LearnChapter__speakIcon"

                                                            xmlns="http://www\.w3.org/2000/svg"

                                                            viewBox="0 0 24 24"

                                                            fill="currentColor"

                                                        >

                                                            <path d="M11 5L6 9H3v6h3l5 4V5z" />

                                                            <path d="M15.5 8.5a5 5 0 010 7" fill="none" stroke="currentColor" strokeWidth="2" />

                                                            <path d="M17.5 6a8 8 0 010 12" fill="none" stroke="currentColor" strokeWidth="2" />

                                                        </svg>

                                                    </button>

                                                </div>



                                            </div>

                                        ))}

                                    </div>



                                </div>

                            ))}

                        </div>

                    )}

                    <button

                        className={`LearnChapter__completeBtn ${isCompleted ? "completed" : ""}`}

                        onClick={handleMarkComplete}

                        disabled={isCompleted || markingComplete}

                    >

                        {isCompleted && (

                            <svg

                                className="complete-icon"

                                viewBox="0 0 24 24"

                                fill="none"

                                stroke="currentColor"

                                strokeWidth="2"

                            >

                                <path d="M20 6L9 17l-5-5" />

                            </svg>

                        )}

                        <span>

                            {markingComplete ? "Saving..." : isCompleted ? "Completed" : "Mark as Complete"}

                        </span>

                    </button>

                </div>

            </div>

        </>

    );

}