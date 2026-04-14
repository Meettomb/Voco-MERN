import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/Voco.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import seal from "../assets/images/CertificateSeal.png"; // add a gold seal image
import AuthorizedSignature from "../assets/images/AuthorizedSignature.png"

export default function Certificate() {

    const REACT_APP_URL = process.env.REACT_APP_URL;
    const { id } = useParams();
    const [cert, setCert] = useState(null);

    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchCert();
    }, []);

    const fetchCert = async () => {
        try {
            const res = await axios.get(
                `${REACT_APP_API_URL}/UserProgressModel/certificate/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (res.data.status === 1) {
                setCert(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const verifyUrl = `${REACT_APP_URL}/certificate/${id}`;

    const downloadCertificate = async () => {
        const element = document.getElementById("certificate");

        const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("landscape", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        //  FULL FIT (NO CENTERING)
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        pdf.save(`${cert.userName}-certificate.pdf`);
    };


    if (!cert) return <p>Loading...</p>;
    return (
        <div style={styles.wrapper}>
            <div id="certificate" style={styles.certificate}>

                {/* 🔝 HEADER */}
                <div style={styles.topSection}>
                    <img src={logo} alt="logo" style={styles.logo} loading="lazy" />
                    <h1 style={styles.title}>Certificate of Completion</h1>
                    <p style={styles.subtitle}>This is proudly presented to</p>
                </div>

                {/* 🎯 CENTER */}
                <div style={styles.centerSection}>
                    <h2 style={styles.name}>{cert.userName}</h2>
                    <p style={styles.text}>for successfully completing the</p>
                    <h3 style={styles.course}>
                        {cert.name} Language Course
                    </h3>

                </div>

                {/* 🔻 FOOTER */}
                <div>

                    <div style={styles.bottomRow}>

                        {/* LEFT SIDE */}
                        <div style={styles.bottomBlock}>
                            <p style={styles.label}>Date</p>
                            <p>{new Date(cert.completedAt).toLocaleDateString()}</p>

                            <img src={AuthorizedSignature} alt="signature" style={styles.signatureImg} loading="lazy" />
                            <div style={styles.line}></div>
                        </div>

                        {/* CENTER → SEAL */}
                        <div style={styles.bottomBlockCenter}>
                            <img src={seal} alt="seal" style={styles.sealFixed} loading="lazy" />
                        </div>

                        {/* RIGHT SIDE */}
                        <div style={styles.bottomBlock}>
                            <p style={styles.label}>Certificate ID</p>
                            <p>VOCO-{id.slice(-6)}</p>

                            <div style={styles.qr}>
                                <QRCodeCanvas
                                    value={verifyUrl}
                                    size={70}
                                />
                                <p style={styles.qrText}>Verify</p>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            {/* Download Button */}
            <button onClick={downloadCertificate} style={styles.button}>
                Download Certificate
            </button>
        </div>
    );
}


const styles = {
    topSection: {
        textAlign: "center"
    },

    centerSection: {
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#0f172a",
        padding: "20px",
        gap: "20px"
    },

    button: {
        padding: "12px 24px",
        fontSize: "16px",
        background: "#d4af37",
        color: "#000",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    seal: {
        position: "absolute",
        bottom: "150px",   // 🔥 adjust upward
        left: "50%",
        transform: "translateX(-50%)",
        width: "80px",
    },

    qr: {
        marginTop: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },

    qrText: {
        fontSize: "12px",
        marginTop: "4px"
    },
    signatureImg: {
        width: "150px",
        filter: "contrast(120%) brightness(95%)",
        opacity: 0.95
    },
    certificate: {
        position: "relative",

        width: "100%",
        maxWidth: "1123px",
        aspectRatio: "297 / 210",

        padding: "60px",
        boxSizing: "border-box",

        background: "#ffffff",
        border: "8px solid #d4af37",

        display: "flex",              //  IMPORTANT
        flexDirection: "column",
        justifyContent: "space-between",
        // alignItems: "center", //  spreads content vertically

        fontFamily: "serif"
    },

    logo: {
        position: "absolute",
        top: "clamp(10px, 2vw, 20px)",
        left: "clamp(10px, 2vw, 20px)",
        width: "clamp(50px, 8vw, 80px)" //  responsive logo
    },

    title: {
        fontSize: "clamp(22px, 4vw, 40px)",
        fontWeight: "bold",
        marginBottom: "10px",
        color: "#1e293b"
    },

    subtitle: {
        fontSize: "clamp(14px, 2vw, 18px)",
        marginBottom: "20px",
        color: "#475569"
    },

    name: {
        fontSize: "clamp(20px, 4vw, 36px)",
        fontWeight: "bold",
        margin: "10px 0"
    },

    text: {
        fontSize: "clamp(14px, 2vw, 18px)"
    },

    course: {
        fontSize: "clamp(16px, 3vw, 24px)",
        fontWeight: "600",
        margin: "10px 0 30px"
    },

    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start", // 🔥 important
        marginTop: "20px"
    },
    bottomRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center", // 🔥 THIS FIXES ALIGNMENT
        marginTop: "40px"
    },

    bottomBlock: {
        width: "30%",
        textAlign: "center"
    },

    bottomBlockCenter: {
        width: "30%",
        textAlign: "center"
    },

    sealFixed: {
        width: "80px"
    },
    footerBlock: {
        flex: "1 1 150px",
        textAlign: "center"
    },

    label: {
        fontWeight: "bold"
    },

    signature: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap", //  stack on mobile
        gap: "20px",
        marginTop: "40px"
    },

    signBlock: {
        flex: "1 1 200px",
        textAlign: "center"
    },

    line: {
        width: "100%",
        maxWidth: "200px",
        margin: "0 auto 5px",
        borderTop: "2px solid #000"
    }
};