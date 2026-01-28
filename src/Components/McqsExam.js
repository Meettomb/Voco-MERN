import React, { useState } from "react";

export default function McqsExam() {

    const questions = [
        {
            question: "1. What is the capital of France?",
            options: ["Berlin", "Madrid", "Paris", "Rome"],
            correct: 2
        },
        {
            question: "2. Which language runs in the browser?",
            options: ["Python", "Java", "C++", "JavaScript"],
            correct: 3
        },
        {
            question: "3. React is mainly used for?",
            options: ["Database", "Design", "User Interface", "Networking"],
            correct: 2
        }
    ];

    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const selectOption = (qIndex, oIndex) => {
        setAnswers({ ...answers, [qIndex]: oIndex });
    };

    const submitExam = () => {

        // Check all questions answered
        if (Object.keys(answers).length !== questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }

        let marks = 0;

        questions.forEach((q, index) => {
            if (answers[index] === q.correct) {
                marks++;
            }
        });

        setScore(marks);
        setShowResult(true);
    };


    return (
        <div className="mcqs-page">

            <div className="mcqs-page__container">

                {/* Header */}
                <div className="mcqs-page__header">
                    <h2>MCQs Exam</h2>
                    <p>Select the correct answer</p>
                </div>

                {/* Questions */}
                <div className="mcqs-page__questions">

                    {questions.map((q, qIndex) => (
                        <div className="mcqs-page__question-card" key={qIndex}>

                            <h3 className="mcqs-page__question">
                                {q.question}
                            </h3>

                            <div className="mcqs-page__options">

                                {q.options.map((opt, oIndex) => (
                                    <button
                                        key={oIndex}
                                        className={
                                            answers[qIndex] === oIndex
                                                ? "mcqs-page__option active"
                                                : "mcqs-page__option"
                                        }
                                        onClick={() => selectOption(qIndex, oIndex)}
                                    >
                                        {opt}
                                    </button>
                                ))}

                            </div>

                        </div>
                    ))}

                </div>

                {/* Submit */}
                <div className="mcqs-page__footer">
                    <button
                        className="mcqs-page__submit-btn"
                        onClick={submitExam}
                        disabled={Object.keys(answers).length !== questions.length}
                    >
                        Submit Exam
                    </button>
                </div>

            </div>

            {/* RESULT POPUP */}
            {showResult && (
                <div className="mcqs-page__modal-overlay">

                    <div className="mcqs-page__modal">

                        <h2>Exam Result</h2>

                        <p>
                            Your Score:
                            <span> {score} </span>
                            / {questions.length}
                        </p>

                        <button
                            className="mcqs-page__close-btn"
                            onClick={() => setShowResult(false)}
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}
