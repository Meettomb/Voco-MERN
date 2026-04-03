import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import usePageTitle from "../../hooks/usePageTitle";
import axios from "axios";
import FullScreenLoader from "../../Components/FullScreenLoader";


export default function EnterEmail() {
    const REACT_APP_API_URL = process.env.REACT_APP_API_URL
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    usePageTitle("Enter Email");
    const { t } = useTranslation();

    const validateEmail = (value) => {
        if (!value) return t("EnterEmail.errors.emailRequired");

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(value)) {
            return t("EnterEmail.errors.emailInvalid");
        }

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const err = validateEmail(email);

        if (err) {
            setError(err);
            return;
        }

        setError("");
        setApiError("");

        try {

            setLoading(true);

            const response = await axios.post(
                `${REACT_APP_API_URL}/ForgotPassword/forgotPasswordOtpSending`,
                { email }
            );

            if (response.data.status === 1) {

                setApiError("");

                localStorage.setItem(
                    "otpData",
                    JSON.stringify({ email })
                );

                localStorage.setItem(
                    "otpExpiry",
                    Date.now() + 2 * 60 * 1000
                );

                window.location.href =
                    "/forgot-password/otp-verify";

            } else {

                setApiError(
                    response.data.message ||
                    t("EnterEmail.errors.otpSendFailed")
                );

            }

        } catch (err) {

            setApiError(
                err.response?.data?.message ||
                t("EnterEmail.errors.serverError")
            );

        } finally {

            setLoading(false);

        }

        console.log(email);
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <>
            {loading && <FullScreenLoader />}
            <div className="enteremail-page">

                <div className="enteremail-page__card">

                    {/* HEADER */}

                    <div className="enteremail-page__header">

                        <button
                            type="button"
                            className="enteremail-page__backBtn"
                            onClick={handleBack}
                        >
                            {/* SVG ICON */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        <h2 className="enteremail-page__title">
                            {t("EnterEmail.title")}
                        </h2>

                    </div>


                    <p className="enteremail-page__subtitle">
                        {t("EnterEmail.subtitle")}
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="enteremail-page__field">

                            <label className="enteremail-page__label">
                                {t("EnterEmail.emailLabel")}
                            </label>

                            <input
                                type="text"
                                className="enteremail-page__input"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                placeholder={t("EnterEmail.emailPlaceholder")}
                            />

                            {error && (
                                <span className="enteremail-page__error">
                                    {error}
                                </span>
                            )}

                        </div>

                        <button
                            type="submit"
                            className="enteremail-page__btn"
                        >
                            {t("EnterEmail.sendButton")}
                        </button>

                    </form>

                </div>

            </div>
        </>
    );
}