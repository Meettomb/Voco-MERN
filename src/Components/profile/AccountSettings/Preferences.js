import React, { useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import usePageTitle from '../../../hooks/usePageTitle';
import AppMessage from '../../../Components/AppMessage';
import useMessage from '../../../hooks/useMessage';

export default function Preferences() {
    usePageTitle("Profile - Preferences");
    const [isEditing, setIsEditing] = React.useState(false);
    const { t } = useTranslation();
    const {
        message,
        messageType,
        showMessage
    } = useMessage();
    const REACT_APP_API_URL = process.env.REACT_APP_API_URL

    const [emailNotifications, setEmailNotifications] = React.useState(false);
    const [reminderTime, setReminderTime] = React.useState("");
    // Errors
    // const [errors, setErrors] = useState({});
    // const [message, setMessage] = useState("");
    // const [messageType, setMessageType] = useState("");

    const { userData, refreshUser } = useAuth();
    const id = userData?._id;



    useEffect(() => {
        const fetchUserPreferences = async () => {
            try {
                const response = await axios.get(
                    `${REACT_APP_API_URL}/userModel/getUserDataById/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (response.data.status === 1) {
                    const user = response.data.data;

                    setEmailNotifications(
                        user.emailNotifications ?? false
                    );

                    setReminderTime(
                        user.reminderTime ?? ""
                    );
                }

            } catch (error) {
                console.error(
                    "Error fetching user preferences:",
                    error
                );
            }
        };

        if (id) {
            fetchUserPreferences();
        }
    }, [id, REACT_APP_API_URL]);

    const handleSavePreferences = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(
                `${REACT_APP_API_URL}/userModel/updateUserPreferencesById/${id}`,
                {
                    emailNotifications,
                    reminderTime,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.status === 1) {
                showMessage(response.data.message, "success");
                setIsEditing(false);
                await refreshUser();
            } else {
                showMessage(response.data.message, "error");
            }

        } catch (error) {
            console.error("Error saving preferences:", error);

            showMessage(
                error.response?.data?.message ||
                "Failed to update preferences",
                "error"
            );
        }
    };

    return (
        <>
            {message && (
                <AppMessage message={message} messageType={messageType} />
            )}
            <div>
                <div className="tab-content AcountSettings" id="preferencesTab">
                    <form onSubmit={handleSavePreferences}>
                        <div className="edit-header">
                            {!isEditing && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="edit-btn"
                                    title={t("Profile.Preferences.edit")}
                                >
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
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Reminder Time + Difficulty Level */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                    {t("Profile.Preferences.reminderTime")}
                                </label>

                                {/* <input
                                type="time"
                                className="form-input"
                                value={reminderTime || ""}
                                onChange={(e) => setReminderTime(e.target.value)}
                                disabled={!isEditing}
                            /> */}

                                <input
                                    type="time"
                                    className="form-input"
                                    value={reminderTime}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                            {/* 
                        <div className="form-group">
                            <label className="form-label">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                {t("Profile.Preferences.difficultyLevel")}
                            </label>

                            <select
                                className="form-input"
                                disabled={!isEditing}
                            >
                                <option value="">
                                    {t("Profile.Preferences.selectDifficulty")}
                                </option>
                                <option value="beginner">
                                    {t("Profile.Preferences.beginner")}
                                </option>
                                <option value="intermediate">
                                    {t("Profile.Preferences.intermediate")}
                                </option>
                                <option value="advanced">
                                    {t("Profile.Preferences.advanced")}
                                </option>
                            </select>
                        </div> */}

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                        {t("Profile.Preferences.emailNotifications")}
                                    </label>

                                    <div className="toggle-container">
                                        <button
                                            type="button"
                                            className={`toggle-switch ${emailNotifications ? "active" : ""
                                                }`}
                                            disabled={!isEditing}
                                            onClick={() =>
                                                setEmailNotifications(!emailNotifications)
                                            }
                                            aria-pressed={emailNotifications}
                                        >
                                            <span className="toggle-slider"></span>
                                        </button>

                                        <span className="toggle-label">
                                            {emailNotifications
                                                ? t("Profile.Preferences.enabled")
                                                : t("Profile.Preferences.disabled")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email Notifications */}


                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="action-buttons">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>
                                        {t("Profile.Preferences.savePreferences")}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsEditing(false)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="1 4 1 10 7 10" />
                                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                    </svg>
                                    <span>
                                        {t("Profile.Preferences.cancel")}
                                    </span>
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}