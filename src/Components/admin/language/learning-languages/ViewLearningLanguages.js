import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import usePageTitle from '../../../../hooks/usePageTitle';

/* ========== SVG ICONS ========== */

const BackIcon = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

/* ========== COMPONENT ========== */

export default function ViewLearningLanguages() {
  usePageTitle("View Learning Language");
  const navigate = useNavigate();   // ✅ back navigation
  const [search, setSearch] = useState("");

  // Static sample data
  const language = {
    english: "Hindi",
    native: "हिंदी",
    chapters: [
      { id: 1, name: "मूल बातें" },
      { id: 2, name: "अभिवादन" },
      { id: 3, name: "संख्या" }
    ]
  };

  const filteredChapters = language.chapters.filter(ch =>
    ch.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-lang-page">

      {/* HEADER */}
      <div className="view-lang-page__header">

        {/* BACK BUTTON */}
        <button
          className="view-lang-page__back-btn"
          onClick={() => navigate(-1)}
        >
          <BackIcon />
        </button>

        <h2>
          {language.english} ({language.native})
        </h2>

        <div className="view-lang-page__actions">

          <div className="view-lang-page__search">
            <SearchIcon />
            <input
              placeholder="Search chapter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Link to="/admin/language/learning-languages/update-learning-language" className="view-lang-page__icon-btn edit">
            <EditIcon />
          </Link>

          <button className="view-lang-page__icon-btn delete">
            <TrashIcon />
          </button>

        </div>

      </div>

      {/* CARD */}
      <div className="view-lang-page__card">

        <h3>Chapters</h3>

        <div className="view-lang-page__list">

          {filteredChapters.map(ch => (
            <div key={ch.id} className="view-lang-page__item">

              <span>Chapter {ch.id}</span>

              <p>{ch.name}</p>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
