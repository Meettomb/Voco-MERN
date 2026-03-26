import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ViewMcq() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [mcq, setMcq] = useState(null);

    const location = useLocation();

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {

        if (location.state?.message) {

            setMessage(location.state.message);
            setMessageType(location.state.type);
            // clear state after reading
            navigate(location.pathname, { replace: true });
        }

    }, [location.navigate]);

    useEffect(() => {
        fetchMcq();
    }, []);

    const fetchMcq = async () => {
        try {

            const res = await axios.get(
                `http://localhost:5000/api/McqsModel/getMcqsById/${id}`
            );

            if (res.data.status === 1) {
                setMcq(res.data.data);
            }

        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {

        if (message) {

            const timer = setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);

            return () => clearTimeout(timer);
        }

    }, [message]);

    const handleDelete = async () => {
        try {

            const res = await axios.delete(
                `http://localhost:5000/api/McqsModel/deleteMcqsById/${id}`
            );

            if (res.data.status === 1) {

                setMessage("MCQ deleted successfully");
                setMessageType("success");

                setTimeout(() => {
                    navigate("/admin/mcq/manage");
                }, 1000);

            } else {

                setMessage("Delete failed");
                setMessageType("error");

            }

        } catch (error) {

            setMessage("Server error");
            setMessageType("error");

            console.log(error);
        }
    };

    if (!mcq) return <div>Loading...</div>;

    const firstQuestion = mcq.questions?.[0];

    const languages = firstQuestion
        ? Object.keys(firstQuestion.question || {})
        : [];

    return (
        <>
            {message && (
                <p
                    className={`app-message ${messageType === "success" ? "success" : "error"
                        }`}
                >
                    {message}
                </p>
            )}
            <div className="viewmcq-page">

                <div className="viewmcq-page__card">

                    <div className="viewmcq-page__header">

                        <h2 className="viewmcq-page__title">
                            View MCQ
                        </h2>

                        <div className="viewmcq-page__actions">

                            {/* Back */}
                            <button
                                className="viewmcq-icon"
                                onClick={() => navigate(-1)}
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>

                            {/* Edit */}
                            <button
                                className="viewmcq-icon"
                                onClick={() =>
                                    navigate(`/admin/mcq/edit/${id}`)
                                }
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                </svg>
                            </button>

                            {/* Delete */}
                            <button
                                className="viewmcq-icon delete"
                                onClick={handleDelete}
                            >
                                <svg viewBox="0 0 24 24">
                                    <path d="M3 6h18" />
                                    <path d="M8 6V4h8v2" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                </svg>
                            </button>

                        </div>

                    </div>

                    {/* Chapter */}
                    <div className="viewmcq-page__field">
                        <label className="viewmcq-page__label">
                            Chapter
                        </label>

                        <div className="viewmcq-page__value">
                            {mcq.chapterIds?.[0]?.translations?.en}
                        </div>
                    </div>


                    {/* Difficulty */}
                    <div className="viewmcq-page__field">
                        <label className="viewmcq-page__label">
                            Difficulty
                        </label>

                        <div className="viewmcq-page__value">
                            {mcq.difficultyLevel}
                        </div>
                    </div>


                    {/* Question */}
                    {/* MCQ by language */}

                    {languages.map(lang => (

                        <div key={lang} className="viewmcq-lang-box">

                            <h3 className="viewmcq-lang-title" style={{ color: "#2a78f5" }}>
                                {lang.toUpperCase()}
                            </h3>

                            {/* Question */}

                            <div className="viewmcq-page__field">

                                <label className="viewmcq-page__label">
                                    Question
                                </label>

                                <div
                                    className="viewmcq-page__editor"
                                    dangerouslySetInnerHTML={{
                                        __html: firstQuestion?.question?.[lang]
                                    }}
                                />

                            </div>


                            {/* Options */}

                            <div className="viewmcq-page__field">

                                <label className="viewmcq-page__label">
                                    Options
                                </label>

                                <div className="viewmcq-page__options">

                                    {firstQuestion?.options?.map((opt, i) => (

                                        <div
                                            key={i}
                                            className={
                                                "viewmcq-page__option " +
                                                (firstQuestion.correctAnswer === i
                                                    ? "correct"
                                                    : "")
                                            }
                                        >
                                            {String.fromCharCode(65 + i)}) {opt[lang]}
                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </>
    );
}