import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChooseLearningLanguage() {

 const navigate = useNavigate();
  const location = useLocation();
// which page user wanted
  const targetPage = location.state?.target || "learn-words";

  const languages = [
    { code: "en", label: "English", native: "English" },
    { code: "es", label: "Spanish", native: "Español" },
    { code: "fr", label: "French", native: "Français" },
    { code: "de", label: "German", native: "Deutsch" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "ja", label: "Japanese", native: "日本語" }
  ];

  // only ONE language
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const chooseLanguage = (lang) => {
    setSelectedLanguage(lang);
  };

 const continueLearning = () => {
    if (!selectedLanguage) return;

    // (optional) save to localStorage
    localStorage.setItem("learningLanguage", JSON.stringify(selectedLanguage));

    // redirect based on original click
    if (targetPage === "videos") {
      navigate("/videos");
    } 
    else if (targetPage === "mcqs-exam") {
      navigate("/mcqs-exam");
    } 
    else {
      navigate("/learn-words");
    }
  };

  return (
    <div className="choose-lang-page">

      <div className="choose-lang-page__container">

        {/* Header */}
        <div className="choose-lang-page__header">
          <h2>Select Language to Learn</h2>
          <p>Choose one language</p>
        </div>

        {/* Grid */}
        <div className="choose-lang-page__grid">

          {languages.map((lang) => (
            <div
              key={lang.code}
              className={
                selectedLanguage?.code === lang.code
                  ? "choose-lang-page__card active"
                  : "choose-lang-page__card"
              }
              onClick={() => chooseLanguage(lang)}
            >
              <span className="native">{lang.native}</span>
              <span className="english"> ({lang.label})</span>
            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="choose-lang-page__footer">
          <button
            className="choose-lang-page__save-btn"
            disabled={!selectedLanguage}
            onClick={continueLearning}
          >
            Continue
          </button>
        </div>

      </div>

    </div>
  );
}
