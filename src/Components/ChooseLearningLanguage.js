import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ChooseLearningLanguage() {
  const { userData, refreshUser, updateActiveLanguage } = useAuth();
  const id = userData?._id;

  const navigate = useNavigate();
  const location = useLocation();
  // which page user wanted
  const targetPage = location.state?.target || "learn-words";
  const { t } = useTranslation();


  const [languages, setLanguages] = useState([]);
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
  // only ONE language
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const chooseLanguage = (lang) => {
    setSelectedLanguage(lang);
  };

  const continueLearning = async () => {
    if (!selectedLanguage) return;

    const langCount = userData?.learningLanguages?.length || 0;

    try {
      // Update DB only if 0 language
      if (langCount === 0) {
        const response = await axios.patch(
          `http://localhost:5000/api/userModel/updateUserById/${id}`,
          {
            learningLanguages: [selectedLanguage._id]
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (response.data.status !== 1) {
          setMessageType("error");
          setMessage("Failed to set learning language: " + response.data.message);
          return;
        }

        await refreshUser();
      }
      
      updateActiveLanguage(selectedLanguage);

      // Navigation (common for all cases)
      if (targetPage === "videos") {
        navigate("/videos", {
          replace: true
        });
      }
      else if (targetPage === "mcqs-exam") {
        navigate("/mcqs-exam", {
          replace: true
        });
      }
      else {
        navigate("/learn-words", {
          replace: true
        });
      }

    } catch (err) {
      setMessageType("error");
      setMessage("An error occurred while setting learning language.");
      console.log(err);
    }
  };

  const getLearningLanguage = async () => {
    try {
      const lang = await axios.get("http://localhost:5000/api/LearningLanguagesModel/getAllLearningLanguages",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (lang.data.status === 1) {
        setLanguages(lang.data.data);
      }

    }
    catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getLearningLanguage();
  }, []);

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

      <div className="choose-lang-page">

        <div className="choose-lang-page__container">

          {/* Header */}
          <div className="choose-lang-page__header">
            <h2>{t("chooseLearningLanguage.title")}</h2>
            <p>{t("chooseLearningLanguage.subtitle")}</p>
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
                <span className="english"> ({lang.english})</span>
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
              {t("chooseLearningLanguage.continue")}
            </button>
          </div>

        </div>

      </div>
    </>
  );
}
