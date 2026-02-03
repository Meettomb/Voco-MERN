import React, { useState } from 'react'

export default function Security() {

    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({});

    // ================= EMAIL VALIDATION =================
    const validateEmailForm = () => {
        let newErrors = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Enter valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ================= PASSWORD VALIDATION =================
    const validatePasswordForm = () => {
        let newErrors = {};

        if (!currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!newPassword) {
            newErrors.newPassword = "New password is required";
        }
        else if (newPassword.length < 8) {
            newErrors.newPassword = "Minimum 8 characters required";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm your password";
        }
        else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ================= SUBMIT HANDLERS =================
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!validateEmailForm()) return;

        console.log("Update Email:", email);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        console.log("Update Password:", {
            currentPassword,
            newPassword
        });
    };

    // ===================================================

    return (
        <div>
            <div className="tab-content AcountSettings" id="securityTab">

                {/* ================= EMAIL SETTINGS ================= */}
                <form onSubmit={handleEmailSubmit}>

                    <h3 className="section-title">Email Settings</h3>

                    <div className="form-group">

                        <label className="form-label">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            Email Address
                        </label>

                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors({ ...errors, email: "" });
                            }}
                        />

                        {errors.email && <p className="error-text">{errors.email}</p>}

                        <div className="form-hint">
                            This email will be used for login and notifications
                        </div>

                        <div className="action-buttons">
                            <button type="submit" className="btn btn-primary">
                                Update Email
                            </button>
                        </div>

                    </div>

                </form>

                {/* ================= CHANGE PASSWORD ================= */}
                <form onSubmit={handlePasswordSubmit}>

                    <h3 className="section-title">Change Password</h3>

                    <div className="form-group">

                        <label className="form-label">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Current Password
                        </label>

                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                setErrors({ ...errors, currentPassword: "" });
                            }}
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
                                New Password
                            </label>

                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setErrors({ ...errors, newPassword: "" });
                                }}
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
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                className="form-input"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setErrors({ ...errors, confirmPassword: "" });
                                }}
                            />

                            {errors.confirmPassword && (
                                <p className="error-text">{errors.confirmPassword}</p>
                            )}
                        </div>

                    </div>

                    <div className="form-hint" style={{ marginBottom: "1.5rem" }}>
                        Password must be at least 8 characters and include uppercase, lowercase,
                        number, and special character
                    </div>

                    <div className="action-buttons">

                        <button type="submit" className="btn btn-primary">
                            Update Password
                        </button>

                        <button type="button" className="btn btn-danger">
                            Delete Account
                        </button>

                    </div>

                </form>

            </div>
        </div>
    )
}
