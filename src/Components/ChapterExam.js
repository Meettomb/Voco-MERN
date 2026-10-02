import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function ChapterExam() {

    const { t } = useTranslation();
    const { activeLanguage, uiLanguage } = useAuth();
    const { state } = useLocation();

    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

    const [timeLeft, setTimeLeft] = useState(0);
    const [examEndTime, setExamEndTime] = useState(null);

    const navigate = useNavigate();

    const [mcqa, setMcqs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const { chapterId } = useParams();

    const questions = mcqa.flatMap(item => item.questions || []);
    const currentQuestion = questions[currentIndex];

    const allAnswered =
        questions.length > 0 &&
        questions.every(q => answers[q._id] !== undefined);


    // ============================================================
    // START / RESET TIMER
    // ============================================================

    const startTimer = (endTime) => {

        const endTimestamp = new Date(endTime).getTime();

        // Save for persistence
        localStorage.setItem("examEndTime", endTimestamp);

        // Store in React state
        setExamEndTime(endTimestamp);

        // Immediately calculate remaining time
        const remaining = Math.floor(
            (endTimestamp - Date.now()) / 1000
        );

        setTimeLeft(Math.max(remaining, 0));
    };


    // ============================================================
    // TIMER
    // ============================================================

    useEffect(() => {

        // Don't run timer while showing result
        if (state?.showResult) {
            setTimeLeft(0);
            setExamEndTime(null);
            return;
        }

        // No exam timer available yet
        if (!examEndTime) {
            return;
        }

        const updateTimer = () => {

            const remaining = Math.floor(
                (examEndTime - Date.now()) / 1000
            );

            if (remaining <= 0) {

                setTimeLeft(0);

                setExamEndTime(null);

                localStorage.removeItem("examEndTime");

                handleSubmitExam();

                return false;
            }

            setTimeLeft(remaining);

            return true;
        };


        // Run immediately
        const shouldContinue = updateTimer();

        if (!shouldContinue) {
            return;
        }


        // Continue every second
        const interval = setInterval(() => {

            const shouldContinue = updateTimer();

            if (!shouldContinue) {
                clearInterval(interval);
            }

        }, 1000);


        // Cleanup
        return () => clearInterval(interval);

    }, [examEndTime, state?.showResult]);


    // ============================================================
    // SUBMIT EXAM
    // ============================================================

    const handleSubmitExam = async () => {

        try {

            const res = await axios.post(
                `${REACT_APP_API_URL}/ExamAttemptModel/submitExam/${chapterId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );


            if (res.data.status === 1) {

                // Clear old timer
                localStorage.removeItem("examEndTime");

                // Clear other exam-related local storage
                localStorage.removeItem("examAnswers");
                localStorage.removeItem("examCurrentIndex");

                // Clear React timer
                setTimeLeft(0);
                setExamEndTime(null);


                // Navigate to Result Page
                navigate("/ExamResult", {
                    replace: true,
                    state: {
                        ...res.data,

                        examType: "chapter",

                        showResult: true,

                        chapterId: chapterId,

                        chapterNumber: state?.chapterNumber,

                        chapterTitle: state?.chapterTitle
                    }
                });
            }

        } catch (err) {

            console.log(err);

        }
    };


    // ============================================================
    // FORMAT TIMER
    // ============================================================

    const formatTime = (seconds) => {

        const min = Math.floor(seconds / 60);

        const sec = seconds % 60;

        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };


    // ============================================================
    // BACK
    // ============================================================

    const navigateBack = () => {
        navigate(-1);
    };


    // ============================================================
    // START + LOAD EXAM
    // ============================================================

    const startAndLoadExam = async () => {

        try {

            // ----------------------------------------------------
            // Reset old timer before starting new exam
            // ----------------------------------------------------

            setTimeLeft(0);
            setExamEndTime(null);

            localStorage.removeItem("examEndTime");


            // ----------------------------------------------------
            // 1. Start exam
            // ----------------------------------------------------

            await axios.post(
                `${REACT_APP_API_URL}/ExamAttemptModel/startExam/${chapterId}`,
                {
                    retry: state?.retry === true
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );


            // ----------------------------------------------------
            // 2. Get questions
            // ----------------------------------------------------

            const res = await axios.get(
                `${REACT_APP_API_URL}/ExamAttemptModel/getExamQuestions/${chapterId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );


            // ----------------------------------------------------
            // 3. Load exam data
            // ----------------------------------------------------

            if (res.data.status === 1) {

                setMcqs(res.data.data.mcqs);


                // ------------------------------------------------
                // Load previously saved answers
                // ------------------------------------------------

                const formattedAnswers = {};

                res.data.data.answers?.forEach(a => {

                    const mcq = res.data.data.mcqs.find(
                        m => m._id === a.mcqId
                    );

                    if (!mcq) return;


                    const question =
                        mcq.questions?.[a.questionIndex];

                    if (!question) return;


                    formattedAnswers[question._id] =
                        a.selectedOption;

                });


                setAnswers(formattedAnswers);


                // ------------------------------------------------
                // START NEW TIMER
                // ------------------------------------------------

                startTimer(
                    res.data.data.endTime
                );
            }

        } catch (error) {

            console.log(
                "Start/Load Exam Error:",
                error
            );

        }
    };


    // ============================================================
    // START EXAM / RETRY
    // ============================================================

    useEffect(() => {

        // Don't start exam while showing result
        if (state?.showResult) {
            return;
        }


        // --------------------------------------------------------
        // Reset exam UI
        // --------------------------------------------------------

        setMcqs([]);

        setAnswers({});

        setCurrentIndex(0);

        setTimeLeft(0);

        setExamEndTime(null);


        // --------------------------------------------------------
        // Clear old exam data
        // --------------------------------------------------------

        localStorage.removeItem("examEndTime");

        localStorage.removeItem("examAnswers");

        localStorage.removeItem("examCurrentIndex");


        // --------------------------------------------------------
        // Start new / retry exam
        // --------------------------------------------------------

        startAndLoadExam();

    }, [
        chapterId,
        state?.retry,
        state?.showResult
    ]);


    // ============================================================
    // NEXT QUESTION
    // ============================================================

    const handleNext = () => {

        if (questions.length === 0) {
            return;
        }

        if (currentIndex < questions.length - 1) {

            setCurrentIndex(
                prev => prev + 1
            );
        }
    };


    // ============================================================
    // PREVIOUS QUESTION
    // ============================================================

    const handlePrev = () => {

        if (questions.length === 0) {
            return;
        }

        if (currentIndex > 0) {

            setCurrentIndex(
                prev => prev - 1
            );
        }
    };


    // ============================================================
    // SELECT OPTION
    // ============================================================

    const handleSelectOption = async (index) => {

        if (!currentQuestion) {
            return;
        }


        const mcq = mcqa.find(
            item =>
                item.questions.some(
                    q => q._id === currentQuestion._id
                )
        );


        if (!mcq) {
            return;
        }


        const questionIndex =
            mcq.questions.findIndex(
                q => q._id === currentQuestion._id
            );


        // Update UI immediately
        setAnswers(prev => ({
            ...prev,

            [currentQuestion._id]: index
        }));


        try {

            await axios.post(
                `${REACT_APP_API_URL}/ExamAttemptModel/saveAnswer/${chapterId}`,
                {
                    mcqId: mcq._id,

                    questionIndex,

                    selectedOption: index
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

        } catch (err) {

            console.log(err);

        }
    };


    // ============================================================
    // CURRENT QUESTION
    // ============================================================

    useEffect(() => {

        if (!currentQuestion) {
            return;
        }

        const saved =
            answers[currentQuestion._id];

        // Currently nothing required here.
        // Kept because it existed in your original code.

    }, [
        currentIndex,
        currentQuestion,
        answers
    ]);


    // ============================================================
    // UI
    // ============================================================

    return (
        <>
            <div className="ChapterExamContainer">

                {/* Header */}
                <div className="examHeader">

                    {/* Left - Back */}
                    <div className="headerLeft">

                        <button
                            className="backBtn"
                            onClick={navigateBack}
                        >

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

                            {t(
                                "ChapterExam.title",
                                {
                                    number:
                                        state?.chapterNumber || 1
                                }
                            )}

                            {" - "}

                            {state?.chapterTitle}

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
                                    __html:
                                        `Q${currentIndex + 1}. ${currentQuestion
                                            ?.question
                                        ?.[uiLanguage?.code]
                                        ||
                                        currentQuestion
                                            ?.question
                                            ?.en
                                        ||
                                        ""
                                        }`
                                }}
                            >
                            </div>


                            <div className="options">

                                {currentQuestion?.options?.map(
                                    (opt, index) => (

                                        <button
                                            key={index}

                                            className={
                                                `option ${answers[
                                                    currentQuestion?._id
                                                ] === index
                                                    ? "correct"
                                                    : ""
                                                }`
                                            }

                                            onClick={() =>
                                                handleSelectOption(index)
                                            }
                                        >

                                            {
                                                opt?.[
                                                uiLanguage?.code
                                                ]
                                                ||
                                                opt?.en
                                            }

                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        {/* Footer Buttons */}
                        <div className="examFooter">

                            {/* LEFT SIDE */}
                            <div className="leftBtns">

                                <button
                                    className="btnSecondary"
                                    onClick={handlePrev}
                                >

                                    {t(
                                        "ChapterExam.previous"
                                    )}

                                </button>


                                <button
                                    className="btnPrimary"
                                    onClick={handleNext}
                                >

                                    {t(
                                        "ChapterExam.next"
                                    )}

                                </button>

                            </div>


                            {/* RIGHT SIDE */}
                            <div className="rightBtns">

                                {allAnswered && (

                                    <button
                                        onClick={handleSubmitExam}
                                        className="btnSubmit"
                                    >

                                        {t(
                                            "ChapterExam.submit"
                                        )}

                                    </button>

                                )}

                            </div>

                        </div>

                        <br />

                        <div>

                            {t(
                                "ChapterExam.progress",
                                {
                                    current:
                                        questions.length > 0
                                            ? currentIndex + 1
                                            : 0,

                                    total:
                                        questions.length
                                }
                            )}

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}