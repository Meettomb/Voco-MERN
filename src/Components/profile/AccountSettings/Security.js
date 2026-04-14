import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../../FullScreenLoader"

export default function Security() {
    const [isEmailEditing, setIsEmailEditing] = useState(false);
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loader, setLoader] = useState(false);


    const REACT_APP_API_URL = process.env.REACT_APP_API_URL
    const { userData } = useAuth();
    const id = userData?._id;
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);

            return () => clearTimeout(timer);
        }

    }, [message]);

    const updateUserPassword = async () => {
        try {
            setLoader(true);

            const res = await axios.patch(
                `${REACT_APP_API_URL}/UserModel/updateUserPasswordById/${id}`,
                {
                    currentPassword,
                    newPassword,
                    confirmPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (res.data.status === 1) {
                navigate("/profile", {
                    state: {
                        message: "Password Updated Successfully",
                        type: "success"
                    }
                });
            } else {
                setMessage(res.data.message || "Something went wrong");
                setMessageType("error");
            }

        } catch (e) {
            console.error(e);

            if (e.response) {
                const msg = e.response.data.message;

                if (msg === "Old password not matched for this user") {
                    setErrors((prev) => ({
                        ...prev,
                        currentPassword: msg
                    }));
                } else {
                    setMessage(msg);
                }
            } else {
                setMessage("Server error");
            }

            setMessageType("error");
        } finally {
            setLoader(false); // ✅ SINGLE SOURCE OF TRUTH
        }
    };

    const [errors, setErrors] = useState({});

    // const user = getUser();
    // const id = user ? user.id : null;

    // ================= EMAIL VALIDATION =================
    const validateEmailForm = () => {
        let newErrors = {};

        if (!email.trim()) {
            newErrors.email = t("Profile.Security.errors.emailRequired");
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t("Profile.Security.errors.invalidEmail");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ================= PASSWORD VALIDATION =================
    const validatePasswordForm = () => {
        let newErrors = {};

        if (!currentPassword) {
            newErrors.currentPassword = t("Profile.Security.errors.currentPasswordRequired");
        }

        if (!newPassword) {
            newErrors.newPassword = t("Profile.Security.errors.newPasswordRequired");
        } else if (newPassword.length < 6) {
            newErrors.newPassword = t("Profile.Security.errors.minPassword");
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = t("Profile.Security.errors.confirmPasswordRequired");
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = t("Profile.Security.errors.passwordMismatch");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ================= SUBMIT HANDLERS =================
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!validateEmailForm()) return;

        setIsEmailEditing(false);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        setIsPasswordEditing(false);
    };

    // ===================================================

    return (
        <>
           {loader && <FullScreenLoader/>}
            {message && (
                <p
                    className={`app-message ${messageType === "success" ? "success" : "error"
                        }`}
                >
                    {message}
                </p>
            )}
            <div>
                <div className="tab-content AcountSettings" id="securityTab">

                    {/* ================= EMAIL SETTINGS ================= */}
                    <form onSubmit={handleEmailSubmit}>

                        <div className="section-header">
                            <h3 className="section-title">{t("Profile.Security.emailSettings")}</h3>

                            {!isEmailEditing && (
                                <button
                                    type="button"
                                    onClick={() => setIsEmailEditing(true)}
                                    className="edit-btn"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="form-group">

                            <label className="form-label">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                {t("Profile.Security.emailAddress")}
                            </label>

                            <input
                                type="email"
                                className="form-input"
                                placeholder={t("Profile.Security.enterEmail")}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors({ ...errors, email: "" });
                                }}
                                disabled={!isEmailEditing}
                            />

                            {errors.email && <p className="error-text">{errors.email}</p>}

                            <div className="form-hint">
                                {t("Profile.Security.emailHint")}
                            </div>

                            {isEmailEditing && (

                                <div className="action-buttons">
                                    <button type="submit" className="btn btn-primary">
                                        {t("Profile.Security.updateEmail")}
                                    </button>

                                    <button type="submit"
                                        className="btn btn-secondary"
                                        onClick={() => setIsEmailEditing(false)}
                                    >
                                        {t("Profile.Security.cancel")}
                                    </button>
                                </div>


                            )}
                        </div>

                    </form>

                    {/* ================= CHANGE PASSWORD ================= */}
                    <form onSubmit={handlePasswordSubmit}>

                        <div className="section-header">
                            <h3 className="section-title" style={{ marginBottom: "20px" }}>{t("Profile.Security.changePassword")}</h3>

                            {!isPasswordEditing && (
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordEditing(true)}
                                    className="edit-btn"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="form-group">

                            <label className="form-label">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                {t("Profile.Security.currentPassword")}
                            </label>

                            <input
                                type="password"
                                className="form-input"
                                placeholder={t("Profile.Security.enterCurrentPassword")}
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                    setErrors({ ...errors, currentPassword: "" });
                                }}
                                disabled={!isPasswordEditing}
                            />

                            {errors.currentPassword && (
                                <p className="error-text">{errors.currentPassword}</p>
                            )}
                        </div>

                        <div className="form-row">

                            <div className="form-group">

                                <label className="form-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    {t("Profile.Security.newPassword")}
                                </label>

                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder={t("Profile.Security.enterNewPassword")}
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        setErrors({ ...errors, newPassword: "" });
                                    }}
                                    disabled={!isPasswordEditing}
                                />

                                {errors.newPassword && (
                                    <p className="error-text">{errors.newPassword}</p>
                                )}
                            </div>

                            <div className="form-group">

                                <label className="form-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {t("Profile.Security.confirmPassword")}
                                </label>

                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder={t("Profile.Security.confirmNewPassword")}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setErrors({ ...errors, confirmPassword: "" });
                                    }}
                                    disabled={!isPasswordEditing}
                                />

                                {errors.confirmPassword && (
                                    <p className="error-text">{errors.confirmPassword}</p>
                                )}
                            </div>

                        </div>

                        <div className="form-hint" style={{ marginBottom: "1.5rem" }}>
                            {t("Profile.Security.passwordHint")}
                        </div>

                        <div className="action-buttons">

                            {isPasswordEditing && (
                                <>
                                    <button type="submit" className="btn btn-primary" onClick={updateUserPassword}>
                                        {t("Profile.Security.updatePassword")}
                                    </button>

                                    <button type="submit"
                                        className="btn btn-secondary"
                                        onClick={() => setIsPasswordEditing(false)}
                                    >
                                        {t("Profile.Security.cancel")}
                                    </button>

                                </>
                            )}

                            <button type="button" className="btn btn-danger">
                                {t("Profile.Security.deleteAccount")}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </>
    )
}
