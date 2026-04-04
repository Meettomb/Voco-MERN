import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ResultPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

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
                        {t("ChapterExamResult.title")}</h1>

                    {/* Score Circle */}
                    <div className="scoreCircle">
                        <span>{state.score}</span>
                        <small>/{state.total}</small>
                    </div>

                    {/* Status */}
                    <p className={`resultStatus ${state.isPassed ? "pass" : "fail"}`}>
                        {state.isPassed
                            ? t("ChapterExamResult.passed")
                            : t("ChapterExamResult.failed")}
                    </p>

                    {/* Actions */}
                    <div className="resultActions">
                        <button className="btnPrimary" onClick={() => navigate("/")}>
                            {t("ChapterExamResult.home")}
                        </button>

                        <button className="btnSecondary" onClick={() => navigate(-1)}>
                            {t("ChapterExamResult.retry")}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}