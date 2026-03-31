import { useState } from 'react';
import getUser from '../../../utils/getUser';
import axios from 'axios';

export default function PersonalDetails() {

    const [isEditing, setIsEditing] = useState(false);

    const options = ["English", "Spanish", "Hindi", "Gujarati", "French", "German"];

    // Selected languages
    const [selected, setSelected] = useState([]);

    // Form values
    const [formData, setFormData] = useState({
        username: "",
        phone: ""
    });

    // Errors
    const [errors, setErrors] = useState({});

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
            setSelected([...selected, value]);
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
            newErrors.username = "Username is required";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        }

        if (selected.length === 0) {
            newErrors.languages = "Please select at least one language";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // -------------------------
    // SUBMIT
    // -------------------------
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const payload = {
            ...formData,
            languages: selected
        };

        console.log("FORM DATA:", payload);

        setIsEditing(false);
    };

    // ===================================================

    return (
        <div className='PersonalDetails AcountSettings'>
            <div className="tab-content active" id="personalTab">

                <form onSubmit={handleSubmit}>

                    <div className="edit-header">
                        {!isEditing && (
                            <button type="button" onClick={() => setIsEditing(true)} 
                            className="edit-btn"
                            title="Edit Personal Details">
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
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                className="form-input"
                                placeholder="Enter your Username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />

                            {errors.username && (
                                <p className="error-text">{errors.username}</p>
                            )}
                        </div>

                        {/* PHONE */}
                        <div className="form-group">
                            <label className="form-label">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />

                            {errors.phone && (
                                <p className="error-text">{errors.phone}</p>
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
                                Learning Language
                            </label>

                            <select className="form-input" onChange={handleSelect}
                                disabled={!isEditing}
                            >
                                <option value="">Select language</option>
                                {options.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>

                            <div className="multi-select-box">
                                {selected.map(lang => (
                                    <span key={lang} className="tag">
                                        {lang}
                                        <button type="button" onClick={() => removeItem(lang)}>×</button>
                                    </span>
                                ))}
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
                                Member Since
                            </label>

                            <input
                                type="text"
                                className="form-input"
                                value="January 2024"
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
                            <span>Save Changes</span>
                        </button>

                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            <span>Cancel</span>
                        </button>

                    </div>
                    )}

                </form>

            </div>
        </div>
    );
}
