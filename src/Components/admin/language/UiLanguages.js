import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function UiLanguages() {

    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState({
        english: "",
        native: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Temporary static data
    const languages = [
        { id: 1, english: "English", native: "English" },
        { id: 2, english: "Hindi", native: "हिंदी" },
        { id: 3, english: "Spanish", native: "Español" }
    ];

    const filteredLanguages = languages.filter(l =>
        l.english.toLowerCase().includes(search.toLowerCase()) ||
        l.native.toLowerCase().includes(search.toLowerCase())
    );

    const submitForm = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form Data:", formData);
        setFormData({ english: "", native: "" });
    }

    return (
        <div className="ui-lang-page">

            {/* HEADER */}
            <div className="ui-lang-page__header">

                <h2 className="ui-lang-page__title">
                    Supported UI Languages
                </h2>

                <div className="ui-lang-page__search">
                    <svg viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>

                    <input
                        type="text"
                        placeholder="Search language..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

            </div>

            {/* ADD FORM (UI ONLY) */}
            <div className="ui-lang-page__card">

                <h3 className="ui-lang-page__card-title">
                    Add New Language
                </h3>

                <div className="ui-lang-page__form">

                    <div className="ui-lang-page__field">
                        <label>Language (English)</label>
                        <input
                            type="text"
                            name="english"
                            placeholder="Hindi"
                            value={formData.english}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="ui-lang-page__field">
                        <label>Language (Native)</label>
                        <input
                            type="text"
                            name="native"
                            placeholder="हिंदी"
                            value={formData.native}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        className="ui-lang-page__btn"
                        disabled={!formData.english || !formData.native}
                        onClick={submitForm}
                    >

                        Add Language
                    </button>

                </div>

            </div>

            {/* TABLE */}
            <div className="ui-lang-page__table-wrapper">

                <table className="ui-lang-page__table">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>English Name</th>
                            <th>Native Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredLanguages.map((lang, index) => (
                            <tr key={lang.id}>

                                <td>{index + 1}</td>
                                <td>{lang.english}</td>
                                <td>{lang.native}</td>

                                <td>
                                    <div className="ui-lang-page__actions">

                                        <Link to="#"
                                            className="ui-lang-page__icon-btn ui-lang-page__icon-btn--edit"
                                            disabled
                                        >
                                            <svg viewBox="0 0 24 24">
                                                <path d="M12 20h9" />
                                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                            </svg>
                                        </Link>

                                        <button
                                            className="ui-lang-page__icon-btn ui-lang-page__icon-btn--delete"
                                            disabled
                                        >
                                            <svg viewBox="0 0 24 24">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6l-1 14H6L5 6" />
                                                <path d="M10 11v6" />
                                                <path d="M14 11v6" />
                                                <path d="M9 6V4h6v2" />
                                            </svg>
                                        </button>

                                    </div>
                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}
