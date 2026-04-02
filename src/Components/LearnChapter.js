import React, { useEffect, useState } from "react";
import FullScreenLoader from "./FullScreenLoader";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function LearnChapter() {
    const { userData, activeLanguage, uiLanguage } = useAuth();
    const { chapterId } = useParams();
    const navigate = useNavigate();

    const [grammarLang, setGrammarLang] = useState(uiLanguage?.code || "en");

    const [chapterData, setChapterData] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(true);

    const learnLang = activeLanguage?.code || "en";
    const baseLang = uiLanguage?.code || "en";

    /*  Safe navigation */
    useEffect(() => {
        if (!chapterId) {
            navigate(-1, { replace: true });
        }
    }, [chapterId]);

    /*  Auto hide message */
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [message]);

    /* ✅ Fetch chapter */
    useEffect(() => {
        if (!userData || !chapterId) return;

        const getChapterLanguage = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/LearningWordsModel/getLearningWords/${chapterId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (res.data.status === 1) {
                    setChapterData(res.data.data); //  FIXED
                } else {
                    setChapterData(null);
                    setMessage("Chapter not found");
                    setMessageType("error");
                }
            } catch (err) {
                console.error(err);
                setMessage("Error fetching chapter");
                setMessageType("error");
            } finally {
                setLoading(false); // correct place
            }
        };

        getChapterLanguage();
    }, [userData, chapterId]);




    const getSpeechLang = (code) => {
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
    };

    const speakText = (text, langCode) => {
        if (!window.speechSynthesis) return;

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = getSpeechLang(langCode);
        utterance.rate = 0.9;
        utterance.pitch = 1;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };



    const speakSelectedText = () => {
        const selected = window.getSelection().toString().trim();

        if (!selected) {
            alert("Please select text first");
            return;
        }

        speakText(selected, grammarLang);
    };


    /* ========================= */

    if (loading) return <FullScreenLoader />;

    if (!chapterData) {
        return <div className="LearnChapter">No Data</div>;
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
                                xmlns="http://www.w3.org/2000/svg"
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
                                    xmlns="http://www.w3.org/2000/svg"
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
                                                            xmlns="http://www.w3.org/2000/svg"
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
                                                            xmlns="http://www.w3.org/2000/svg"
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

                </div>
            </div>
        </>
    );
}