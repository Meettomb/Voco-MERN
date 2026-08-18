import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmailChange() {

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [otp, setOtp] = useState("");

    const [message, setMessage] = useState("");

    const [messageType, setMessageType] = useState("");

    const [loading, setLoading] = useState(false);

    const [verified, setVerified] = useState(false);

    const navigate = useNavigate();

    const REACT_APP_API_URL =
        process.env.REACT_APP_API_URL;


    const handleVerify = async (e) => {

        e.preventDefault();

        if (!otp || otp.length !== 6) {

            setMessage("Please enter a valid 6-digit OTP");
            setMessageType("error");

            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                `${REACT_APP_API_URL}/userModel/verifyEmailChange`,
                {
                    token,
                    otp,
                }
            );

            if (response.data.status === 1) {

                // Show success page
                setVerified(true);

                setMessage(
                    "Your email address has been updated successfully."
                );

                setMessageType("success");

                // Redirect after 3 seconds
                setTimeout(() => {

                    navigate("/profile", {
                        replace: true,
                        state: {
                            message:
                                "Email address updated successfully",
                            type: "success"
                        }
                    });

                }, 3000);

            } else {

                setMessage(
                    response.data.message ||
                    "Verification failed"
                );

                setMessageType("error");

            }

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Verification failed"
            );

            setMessageType("error");

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // SUCCESS PAGE
    // ==========================================

    if (verified) {

        return (
            <div className="VerifyEmailChange">

                <div className="verify-card success-card">

                    <div className="verify-success-icon">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 6L9 17l-5-5" />
                        </svg>

                    </div>

                    <h2 className="verify-title">
                        Email Updated Successfully
                    </h2>

                    <p className="verify-description">
                        Your LearnVoco email address has been
                        successfully updated.
                    </p>

                    <div className="verify-success-message">
                        <span>
                            ✓
                        </span>

                        Your email address is now verified.
                    </div>

                    <p className="verify-redirect-message">
                        Redirecting to your profile...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // VERIFICATION PAGE
    // ==========================================

    return (
        <div className="VerifyEmailChange">

            <div className="verify-card">

                <div className="verify-icon">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect
                            x="3"
                            y="5"
                            width="18"
                            height="14"
                            rx="2"
                        />

                        <polyline points="3 7 12 13 21 7" />
                    </svg>

                </div>


                <h2 className="verify-title">
                    Verify Email Change
                </h2>


                <p className="verify-description">
                    Enter the 6-digit OTP sent to your
                    old email address.
                </p>


                <form
                    className="verify-form"
                    onSubmit={handleVerify}
                >

                    <label className="otp-label">
                        Verification Code
                    </label>


                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        className="otp-input"
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                        placeholder="Enter 6-digit OTP"
                    />


                    <button
                        type="submit"
                        className="verify-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Verifying..."
                            : "Verify Email"}

                    </button>

                </form>


                {message && (
                    <p
                        className={`verify-message ${messageType}`}
                    >
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}