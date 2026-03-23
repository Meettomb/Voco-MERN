import React, { useEffect, useState } from "react";
import axios from "axios";
import usePageTitle from "../../../hooks/usePageTitle";
import { useParams, useNavigate, useLocation } from "react-router-dom";


import FullScreenLoader from "../../FullScreenLoader";

export default function ViewChapters() {

    usePageTitle("Chapters");

    const [loading, setLoading] = useState(false);

    const { languageId } = useParams();

    const [chapters, setChapters] = useState([]);

    const location = useLocation();
    const [message, setMessage] = useState(
        location.state?.message || ""
    );

    const [messageType, setMessageType] = useState(
        location.state?.type || ""
    );

    const navigate = useNavigate();

    useEffect(() => {

        if (message) {

            const timer = setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);

            return () => clearTimeout(timer);
        }

    }, [message]);

    useEffect(() => {

        setLoading(true);

        axios
            .get(
                "http://localhost:5000/api/LearningLanguagesModel/getAllLearningLanguages"
            )
            .then(res => {

                const lang = res.data.data.find(
                    l => l._id === languageId
                );

                if (lang) {
                    setChapters(lang.chapters);
                }

            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [languageId]);


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
            {loading && <FullScreenLoader />}

            <div className="view-word">

                <div className="view-word__card">

                    {/* HEADER */}
                    <div className="view-word__header">

                        <button
                            className="view-word__back-btn"
                            onClick={() => window.history.back()}
                        >
                            ← Back
                        </button>

                        <h2>Chapters</h2>

                        <div />

                    </div>


                    {/* CONTENT */}
                    <div className="view-word__content">

                        {chapters.length === 0 && !loading && (

                            <div className="view-word__row">
                                <span>No Chapters Found</span>
                            </div>

                        )}


                        {chapters.map(ch => (

                            <div
                                key={ch._id}
                                className="view-word__row"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                    navigate(`/admin/words/view/${ch._id}`)
                                }
                            >

                                <span>Chapter</span>

                                <p>
                                    {ch.translations?.en}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </div>
        </>

    );

}