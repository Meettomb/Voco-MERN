import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function FinalExam() {

    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const lang = uiLanguage?.code;
    const { activeLanguage, uiLanguage } = useAuth();
    const { state } = useLocation();
    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
    const [timeLeft, setTimeLeft] = useState(0);
    const navigate = useNavigate();
    const [mcqa, setMcqs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const questions = mcqa.flatMap(item => item.questions || []);
    const currentQuestion = questions[currentIndex];
    const [answers, setAnswers] = useState({});

    const { code } = useParams();
    // console.log("CLICK CODE:", code);   

    const allAnswered = questions.length > 0 &&
        questions.every(q => answers[q._id] !== undefined);

    useEffect(() => {
        const blockBack = (e) => {
            e.preventDefault();
            window.history.pushState(null, "", window.location.href);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", blockBack);

        return () => window.removeEventListener("popstate", blockBack);
    }, []);

    useEffect(() => {
        const endTime = localStorage.getItem("examEndTime");

        if (!endTime) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.floor((endTime - now) / 1000);

            if (remaining <= 0) {
                clearInterval(interval);
                setTimeLeft(0);

                localStorage.removeItem("examEndTime");
                handleSubmitExam();
                return;
            }

            setTimeLeft(remaining);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmitExam = async () => {
        try {
            const res = await axios.post(
                `${REACT_APP_API_URL}/ExamAttemptModel/final-exam/submit/${code}`,
                {
                    answers: Object.entries(answers).map(([qId, option]) => ({
                        questionId: qId,
                        selectedOption: option
                    }))
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (res.data.status === 1) {
                localStorage.removeItem("examEndTime");

                navigate("/ExamResult", {
                    replace: true,
                    state: {
                        ...res.data,
                        examType: "final"
                    }
                });
            }

        } catch (err) {
            console.log(err);
        }
    };
    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };
    const navigateBack = () => {
        navigate(-1);
    };

    const loadFinalExam = async () => {
        try {
            const res = await axios.get(
                `${REACT_APP_API_URL}/ExamAttemptModel/getFinalExamQuestions/${code}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (res.data.status === 1) {
                setMcqs(res.data.data.mcqs);

                const formattedAnswers = {};
                res.data.data.answers?.forEach(a => {
                    const mcq = res.data.data.mcqs.find(m => m._id === a.mcqId);

                    if (!mcq) return;

                    const question = mcq.questions?.[a.questionIndex];

                    if (question) {
                        formattedAnswers[question._id] = a.selectedOption;
                    }

                    formattedAnswers[a.questionId] = a.selectedOption;
                });

                setAnswers(formattedAnswers);

                // Sync timer from backend
                const endTime = new Date(res.data.data.endTime).getTime();
                localStorage.setItem("examEndTime", endTime);

                const remaining = Math.floor((endTime - Date.now()) / 1000);
                setTimeLeft(remaining > 0 ? remaining : 0);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const hasStarted = React.useRef(false);

    useEffect(() => {
        if (hasStarted.current) return;
        hasStarted.current = true;

        loadFinalExam();
    }, [code]);


    const handleNext = () => {

        if (questions.length === 0) return;

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {

        if (questions.length === 0) return;

        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSelectOption = async (index) => {
        if (!currentQuestion) return;

        // update UI instantly
        setAnswers(prev => ({
            ...prev,
            [currentQuestion._id]: index
        }));

        try {

            const mcq = mcqa.find(item =>
                item.questions.some(q => q._id === currentQuestion._id)
            );

            const questionIndex = mcq.questions.findIndex(
                q => q._id === currentQuestion._id
            );

            await axios.post(
                `${REACT_APP_API_URL}/ExamAttemptModel/final-exam/save-answer/${code}`,
                {
                    mcqId: mcq._id,
                    questionIndex: questionIndex,
                    selectedOption: index
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!currentQuestion) return;

        const saved = answers[currentQuestion._id];

    }, [currentIndex, currentQuestion, answers]);
    // if (isSubmitting) return;
    // setIsSubmitting(true);

    if (!currentQuestion) {
        return <div>Loading exam...</div>;
    }

    return (
        <>
            <div className="ChapterExamContainer">
                {/* Header */}
                <div className="examHeader">

                    {/* Left - Back */}
                    <div className="headerLeft">
                        <button className="backBtn" onClick={navigateBack}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            {t("ChapterExam.back")}
                        </button>
                    </div>

                    {/* Center - Title */}
                    <div className="headerCenter">
                        <h2>
                            Final Exam - {activeLanguage?.english}
                        </h2>
                    </div>

                    {/* Right - Timer */}
                    <div className="headerRight">
                        <div className="timer">
                            ⏱ {formatTime(timeLeft)}
                        </div>
                    </div>

                </div>
                <div className="chapterExam">

                    <div className="examContainer">



                        {/* Question Card */}
                        <div className="questionCard">
                            <div
                                className="questionTitle"
                                dangerouslySetInnerHTML={{
                                    __html: `Q${currentIndex + 1}. ${currentQuestion?.question?.[uiLanguage?.code] ||
                                        currentQuestion?.question?.en ||
                                        ""
                                        }`
                                }}
                            ></div>
                            <div className="options">
                                {currentQuestion?.options?.map((opt, index) => (
                                    <button
                                        key={index}
                                        className={`option ${answers[currentQuestion?._id] === index ? "correct" : ""
                                            }`}
                                        onClick={() => handleSelectOption(index)}
                                    >
                                        {opt?.[uiLanguage?.code] || opt?.en}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="examFooter">

                            {/* LEFT SIDE */}
                            <div className="leftBtns">
                                <button className="btnSecondary" onClick={handlePrev}>
                                    {t("ChapterExam.previous")}
                                </button>

                                <button className="btnPrimary" onClick={handleNext}>
                                    {t("ChapterExam.next")}
                                </button>
                            </div>

                            {/* RIGHT SIDE */}
                            <div className="rightBtns">
                                {allAnswered && (
                                    <button onClick={handleSubmitExam} className="btnSubmit">
                                        {t("ChapterExam.submit")}
                                    </button>
                                )}
                            </div>

                        </div><br />
                        <div>
                            {t("ChapterExam.progress", {
                                current: questions.length > 0 ? currentIndex + 1 : 0,
                                total: questions.length
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}