import React, { useState } from "react";
import { Link } from "react-router-dom";
import usePageTitle from '../../../hooks/usePageTitle';

function ManageWords() {

    usePageTitle("Manage Learn Words");

    // Static Data (later replace with API)
    const [words] = useState([
        {
            id: 1,
            chapter: "Basics",
            difficulty: "Medium",
            en: "Thanks",
            fr: "Merci",
        },
        {
            id: 2,
            chapter: "Basics",
            difficulty: "Easy",
            en: "Hello",
            fr: "Bonjour",
        },
        {
            id: 3,
            chapter: "Travel",
            difficulty: "Easy",
            en: "Airport",
            fr: "Aéroport",
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");

    // Filter Logic
    const filteredWords = words.filter((word) =>
        word.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-words">
            <div className="manage-words__card">

                {/* Header */}
                <div className="manage-words__header">
                    <h2>Manage Words</h2>

                    <div className="manage-words__header-right">

                        {/* Search */}
                        <div className="manage-words__search">
                            <svg viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.3-4.3" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search word..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Add Button */}
                        <Link to="/admin/words/add" className="manage-words__add-btn">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add Word
                        </Link>

                    </div>
                </div>

                {/* Table */}
                <div className="manage-words__table-wrapper">
                    <table className="manage-words__table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Chapter</th>
                                <th>Difficulty</th>
                                <th>EN Word</th>
                                <th>FR Word</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredWords.length > 0 ? (
                                filteredWords.map((word, index) => (
                                    <tr key={word.id}>
                                        <td>{index + 1}</td>
                                        <td>{word.chapter}</td>
                                        <td>{word.difficulty}</td>
                                        <td>{word.en}</td>
                                        <td>{word.fr}</td>
                                        <td>
                                            <div className="manage-words__actions">

                                                {/* View */}
                                                <Link
                                                    to="/admin/words/view"
                                                    className="manage-words__icon-btn edit"
                                                >
                                                    <svg viewBox="0 0 24 24">
                                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                </Link>

                                                {/* Edit */}
                                                <Link
                                                    to="/admin/words/edit"
                                                    className="manage-words__icon-btn edit"
                                                >
                                                    <svg viewBox="0 0 24 24">
                                                        <path d="M12 20h9" />
                                                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                                    </svg>
                                                </Link>

                                                {/* Delete */}
                                                <button className="manage-words__icon-btn delete">
                                                    <svg viewBox="0 0 24 24">
                                                        <path d="M3 6h18" />
                                                        <path d="M8 6V4h8v2" />
                                                        <path d="M19 6l-1 14H6L5 6" />
                                                    </svg>
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>
                                        No words found
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default ManageWords;
