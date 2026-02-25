import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

function SelectLearningLanguage({ onBack }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  usePageTitle("Select Learning Language");

  return (
    <div className="sll-page">
      <div className="sll-container">

        {/* Header */}
        <div className="sll-header">

          {/* Back Button */}
          <button
            className="sll-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <h1>{t("SelectLearnLangauge.title")}</h1>
          <p>{t("SelectLearnLangauge.subtitle")}</p>
        </div>

        {/* Language Cards */}
        <div className="sll-language-grid">

          {/* English */}
          <div
            className={`sll-language-card ${selected === "en" ? "active" : ""}`}
            onClick={() => setSelected("en")}
          >
            <div className="sll-language-icon">
              <svg viewBox="0 0 24 24">
                <path d="M4 4h16v16H4z" />
                <path d="M8 7h8M8 11h6M8 15h4" />
              </svg>
            </div>
            <h3>{t("SelectLearnLangauge.english.title")}</h3>
            <p>{t("SelectLearnLangauge.english.description")}</p>
          </div>

          {/* Hindi */}
          <div
            className={`sll-language-card ${selected === "hi" ? "active" : ""}`}
            onClick={() => setSelected("hi")}
          >
            <div className="sll-language-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 10h8M12 8v8" />
              </svg>
            </div>
            <h3>{t("SelectLearnLangauge.hindi.title")}</h3>
            <p>{t("SelectLearnLangauge.hindi.description")}</p>
          </div>

        </div>

        {/* CTA */}
        <button className="sll-primary-btn" disabled={!selected}>
          {t("SelectLearnLangauge.cta")}
        </button>

      </div>
    </div>
  );
}

export default SelectLearningLanguage;
