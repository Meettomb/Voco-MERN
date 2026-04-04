import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ChapterExam() {

    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
    const [timeLeft, setTimeLeft] = useState(0);
    const navigate = useNavigate();
    const [mcqa, setMcqs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);

    const questions = mcqa.flatMap(item => item.questions || []);
    const currentQuestion = questions[currentIndex];

    const { chapterId } = useParams();

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

                // OPTIONAL: auto submit / redirect
                // alert("Time's up!");
                return;
            }

            setTimeLeft(remaining);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };
    const navigateBack = () => {
        navigate(-1);
    };

    const getMCQsChapterWise = async () => {
        try {
            const mcqsResponse = await axios.get(`${REACT_APP_API_URL}/McqsModel/getMcqByChapterId/${chapterId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )

            if (mcqsResponse.data.status === 1) {
                setMcqs(mcqsResponse.data.data)
                console.log(mcqsResponse.data.data)
            } else {
                console.log(mcqsResponse.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getMCQsChapterWise();
    }, [chapterId])


    const handleNext = () => {
        console.log("NEXT CLICKED");

        if (questions.length === 0) return;

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
        }
    };

    const handlePrev = () => {
        console.log("PREV CLICKED");

        if (questions.length === 0) return;

        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setSelectedOption(null);
        }
    };

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
                            Back
                        </button>
                    </div>

                    {/* Center - Title */}
                    <div className="headerCenter">
                        <h2>Chapter 1 Exam</h2>
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
                                    __html: `Q${currentIndex + 1}. ${currentQuestion?.question?.en || ""}`
                                }}
                            ></div>
                            <div className="options">
                                {currentQuestion?.options?.map((opt, index) => (
                                    <button
                                        key={index}
                                        className={`option ${selectedOption === index ? "selected" : ""}`}
                                        onClick={() => setSelectedOption(index)}
                                    >
                                        {opt?.en}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="examFooter">
                            <button className="btnSecondary" onClick={handlePrev}>
                                Previous
                            </button>
                            <button className="btnPrimary" onClick={handleNext}>
                                Next
                            </button>
                        </div><br />
                        <div>Index: {currentIndex} / {questions.length}</div>

                    </div>
                </div>
            </div>
        </>
    );
}