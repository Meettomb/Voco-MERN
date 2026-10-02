import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../../../hooks/usePageTitle';

export default function PersonalDetails() {
    usePageTitle("Profile - Personal Details");
    const REACT_APP_API_URL = process.env.REACT_APP_API_URL
    const { t } = useTranslation()
    const [isEditing, setIsEditing] = useState(false);
    const [languages, setLanguages] = useState([]);
    // Selected languages
    const [selected, setSelected] = useState([]);

    const navigate = useNavigate();

    // Form values
    const [formData, setFormData] = useState({
        username: "",
        phoneNumber: "",
        languages: [],
    });

    // Errors
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 3000);

            return () => clearTimeout(timer);
        }

    }, [message]);

    const { userData, refreshUser } = useAuth();
    const id = userData?._id;

    const getLearningLanguages = useCallback(async () => {
        try {
            const response = await axios.get(
                `${REACT_APP_API_URL}/LearningLanguagesModel/getAllLearningLanguages`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }
            );

            if (response.data.status === 1) {
                setLanguages(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching learning languages:", error);
        }
    }, []);
    useEffect(() => {
        getLearningLanguages();
    }, [getLearningLanguages]);

    useEffect(() => {
        if (userData) {
            setFormData(userData);

            const ids = userData.learningLanguages?.map(l =>
                typeof l === "object" ? l._id : l
            ) || [];

            setSelected(ids);
        }
    }, [userData]);



    // -------------------------
    // INPUT CHANGE
    // -------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setErrors({
            ...errors,
            [name]: ""
        });
    };

    // -------------------------
    // LANGUAGE SELECT
    // -------------------------
    const handleSelect = (e) => {
        const value = e.target.value;

        if (value && !selected.includes(value)) {
            setSelected(prev => [...prev, value]); // safer update
            setErrors({ ...errors, languages: "" });
        }

        e.target.value = "";
    };

    const removeItem = (lang) => {
        setSelected(selected.filter(item => item !== lang));
    };

    // -------------------------
    // VALIDATION
    // -------------------------
    const validateForm = () => {
        let newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = t("Profile.PersonalDetails.errors.usernameRequired");
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = t("Profile.PersonalDetails.errors.phoneRequired");
        }

        if (selected.length === 0) {
            newErrors.languages = t("Profile.PersonalDetails.errors.languageRequired");
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // -------------------------
    // SUBMIT
    // -------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (!id) return;

        const payload = {
            username: formData.username,
            phoneNumber: formData.phoneNumber,
            learningLanguages: selected
        };

        try {
            const response = await axios.patch(
                `${REACT_APP_API_URL}/userModel/updateUserPersonalDetailById/${id}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }
            );
            if (response.data.status === 2) {
                localStorage.setItem("otpData", JSON.stringify({
                    ...response.data.tempData,
                    _id: id
                }));
                //  Redirect to verification page
                navigate("/PhoneNumberVerify", {
                    state: {
                        ...response.data.tempData,
                        _id: id
                    }
                });
                return;
            } else if (response.data.status === 1) {
                setMessage(t("Profile.PersonalDetails.messages.success"));
                setMessageType("success");

                await refreshUser(); // refetch to get updated data
                setIsEditing(false);

            } else {
                setMessage(t("Profile.PersonalDetails.messages.failed"));
                setMessageType("error");
            }
        }
        catch (error) {
            console.error("Error updating user data:", error);
        }
        setIsEditing(false);
    };

    // ===================================================

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
            <div className='PersonalDetails AcountSettings'>
                <div className="tab-content active" id="personalTab">

                    <form onSubmit={handleSubmit}>

                        <div className="edit-header">
                            {!isEditing && (
                                <button type="button" onClick={() => setIsEditing(true)}
                                    className="edit-btn"
                                    title={t("Profile.PersonalDetails.edit")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* ================= ROW 1 ================= */}
                        <div className="form-row">



                            {/* Username */}
                            <div className="form-group">
                                <label className="form-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    {t("Profile.PersonalDetails.username")}

                                </label>

                                <input
                                    type="text"
                                    name="username"
                                    className="form-input"
                                    placeholder={t("Profile.PersonalDetails.enterUsername")}
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                                {errors.username && (
                                    <p className="error-text">{errors.username}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="form-group">
                                <label className="form-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <p>
                                        {t("Profile.PersonalDetails.phoneNumber")}

                                        {!userData?.phoneNumberVerified && (<span title={t("Profile.PersonalDetails.needVerification")} style={{ display: "inline-flex", alignItems: "center", marginLeft: "5px" }}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#f59e0b" // amber warning color
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                <line x1="12" y1="9" x2="12" y2="13" />
                                                <circle cx="12" cy="17" r="1" />
                                            </svg>
                                        </span>)}

                                    </p>
                                </label>

                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    className="form-input"
                                    placeholder={t("Profile.PersonalDetails.enterPhone")}
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />

                                {errors.phoneNumber && (
                                    <p className="error-text">{errors.phoneNumber}</p>
                                )}
                            </div>

                        </div>

                        {/* ================= ROW 2 ================= */}
                        <div className="form-row">

                            {/* LEARNING LANGUAGE */}
                            <div className="form-group">
                                <label className="form-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10
                                        15.3 15.3 0 0 1-4 10
                                        15.3 15.3 0 0 1-4-10
                                        15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                    {t("Profile.PersonalDetails.learningLanguage")}
                                </label>

                                <select
                                    className="form-input"
                                    onChange={handleSelect}
                                    disabled={!isEditing}
                                >
                                    <option value="">{t("Profile.PersonalDetails.selectLanguage")}</option>

                                    {languages.map((lang) => (
                                        <option key={lang._id} value={lang._id}>
                                            {lang.native}
                                        </option>
                                    ))}
                                </select>

                                <div className="multi-select-box">
                                    {selected.map((id, index) => {
                                        const lang = languages.find(l => l._id === id);

                                        return (
                                            <span key={id || index} className="tag">
                                                {lang?.native || "Unknown"}
                                                {isEditing && (
                                                    <button type="button" onClick={() => removeItem(id)}>&times;</button>
                                                )}
                                            </span>
                                        );
                                    })}
                                </div>

                                {errors.languages && (
                                    <p className="error-text">{errors.languages}</p>
                                )}
                            </div>

                            {/* MEMBER SINCE */}
                            <div className="form-group">
                                <label className="form-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    {t("Profile.PersonalDetails.memberSince")}
                                </label>

                                <input
                                    type="text"
                                    className="form-input"
                                    value={
                                        formData.createdAt
                                            ? new Date(formData.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long"
                                            })
                                            : ""
                                    }
                                    disabled
                                />
                            </div>

                        </div>

                        {/* ================= BUTTONS ================= */}
                        {isEditing && (
                            <div className="action-buttons">

                                <button type="submit" className="btn btn-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>{t("Profile.PersonalDetails.saveChanges")}</span>
                                </button>

                                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                    <span>{t("Profile.PersonalDetails.cancel")}</span>
                                </button>

                            </div>
                        )}

                    </form>

                </div>
            </div>

        </>
    );
}
