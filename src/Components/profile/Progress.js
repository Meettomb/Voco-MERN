import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Progress() {
    const [certificates, setCertificates] = useState([]);

    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

    const navigate = useNavigate();
    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/UserProgressModel/certificates`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.status === 1) {
                setCertificates(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="cert-page">
            <div className="cert-page__container">

                <div className="cert-page__header">
                    <h1>My Certificates</h1>
                    <p>All your earned certifications</p>
                </div>

                <div className="cert-page__list">

                    {certificates.length === 0 && (
                        <p>No certificates yet</p>
                    )}

                    {certificates.map((cert) => (
                        <div key={cert.languageId} className="cert-page__list cert-card">

                            {/* LEFT */}
                            <div className="cert-page__list cert-card__left">
                                <div className="cert-page__list cert-card__icon">🎓</div>

                                <div className="cert-page__list cert-card__content">
                                    <h3>{cert.name}</h3>
                                    <p>
                                        Completed on{" "}
                                        {new Date(cert.completedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="cert-page__list cert-card__right">
                                <span className="cert-badge success">Completed</span>
                                <button className="cert-btn"
                                    onClick={() =>
                                        navigate(`/certificate/${cert.languageId}`, {
                                            state: cert,
                                        })
                                    }
                                >View</button>
                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}