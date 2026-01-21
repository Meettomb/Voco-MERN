import { useState } from "react";
import { useTranslation } from "react-i18next";

function LearnWords() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);

  return (
    <div className="learn-words-page">
      <div className="learn-words-container">

        {/* Header */}
        <div className="learn-words-header">
          <h1>{t("LearnWords.title")}</h1>
          <p>{t("LearnWords.subtitle")}</p>
        </div>

        {/* Language Cards */}
        <div className="language-grid">

          {/* English */}
          <div
            className={`language-card ${selected === "en" ? "active" : ""}`}
            onClick={() => setSelected("en")}
          >
            <div className="language-icon">
              <svg viewBox="0 0 24 24">
                <path d="M4 4h16v16H4z" />
                <path d="M8 7h8M8 11h6M8 15h4" />
              </svg>
            </div>
            <h3>{t("LearnWords.english.title")}</h3>
            <p>{t("LearnWords.english.description")}</p>
          </div>

          {/* Hindi */}
          <div
            className={`language-card ${selected === "hi" ? "active" : ""}`}
            onClick={() => setSelected("hi")}
          >
            <div className="language-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 10h8M12 8v8" />
              </svg>
            </div>
            <h3>{t("LearnWords.hindi.title")}</h3>
            <p>{t("LearnWords.hindi.description")}</p>
          </div>

        </div>

        {/* CTA */}
        <button className="primary-btn" disabled={!selected}>
          {t("LearnWords.cta")}
        </button>

      </div>
    </div>
  );
}

export default LearnWords;