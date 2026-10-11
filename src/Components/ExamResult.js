import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiCache from "../services/ApiCache";
import { useAuth } from "../context/AuthContext";

export default function ResultPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isFinal = state?.examType === "final";
    const { activeLanguage } = useAuth();

    return (
        <div className="resultPage_container">
            <div className="resultPage">

                <div className="resultCard">

                    {/* Back */}
                    <div className="resultHeader">
                        <button className="backBtn" onClick={() => navigate(-1)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            {t("ChapterExamResult.back")}
                        </button>
                    </div>

                    {/* Title */}
                    <h1 className="resultTitle">
                        {isFinal
                            ? t("FinalExamResult.title")
                            : t("ChapterExamResult.title")}
                    </h1>

                    {/* Score Circle */}
                    <div className="scoreCircle">
                        <span>{state.score}</span>
                        <small>/{state.total}</small>
                    </div>

                    {/* Status */}
                    <p className={`resultStatus ${state.isPassed ? "pass" : "fail"}`}>
                        {state.isPassed
                            ? (isFinal
                                ? t("FinalExamResult.passed")
                                : t("ChapterExamResult.passed"))
                            : (isFinal
                                ? t("FinalExamResult.failed")
                                : t("ChapterExamResult.failed"))}
                    </p>

                    {/* Actions */}
                    <div className="resultActions">
                        <button
                            className="btnPrimary"
                            name="home"
                            onClick={() => {
                                if (activeLanguage?._id) {
                                    apiCache.invalidate(
                                        `learn-words:${activeLanguage._id}`
                                    );
                                }

                                navigate("/");
                            }}
                        >
                            {t(isFinal ? "FinalExamResult.home" : "ChapterExamResult.home")}
                        </button>


                        <button name="retry"
                            className="btnSecondary"
                            onClick={() => {
                                if (isFinal) {

                                    localStorage.removeItem("examEndTime");

                                    navigate(`/FinalExam/${state.code}`, {
                                        replace: true,
                                        state: {
                                            retry: true
                                        }
                                    });

                                } else {
                                    // Clear previous exam timer
                                    localStorage.removeItem("examEndTime");

                                    // Go back to the same chapter exam
                                    navigate(`/ChapterExam/${state.chapterId}`, {
                                        replace: true,
                                        state: {
                                            chapterNumber: state.chapterNumber,
                                            chapterTitle: state.chapterTitle,
                                            retry: true
                                        }
                                    });
                                }
                            }}
                        >
                            {t(isFinal ? "FinalExamResult.retry" : "ChapterExamResult.retry")}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}