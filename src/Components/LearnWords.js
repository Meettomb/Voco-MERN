import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import usePageTitle from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function LearnWords() {

  const { activeLanguage, uiLanguage } = useAuth();
  const { t } = useTranslation();
  usePageTitle("Learn Words");

  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/LearningWordsModel/getLearningWords",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const filtered = res.data.data.filter(
          (item) =>
            item.learningWordsLangauge?._id === activeLanguage?._id
        );

        setChapters(filtered);

      } catch (err) {
        console.error(err);
      }
    };

    if (activeLanguage?._id) {
      fetchChapters();
    }

  }, [activeLanguage]);


  const handleStartLearning = (chapterId) => {
    // handle navigation to learning page for the selected chapter
  }

  return (
    <div className="lw-page">

      {/* TITLE */}
      <h1 className="lw-title">
        {t("LearnWords.title")} - {
          uiLanguage?.code === activeLanguage?.code
            ? activeLanguage?.native
            : activeLanguage?.english
        }
      </h1>

      {/* ROADMAP */}
      <div className="lw-roadmap">
        {chapters.map((item, index) => (

          <div className="lw-step" key={item._id}>

            <div className="lw-dot">
              {index + 1}
            </div>

            <div className="lw-card">
              {/* Chapter Number */}
              <h3>
                {t("LearnWords.chapter", { number: index + 1 })}
              </h3>
              <p>
                {
                  item.chapterId?.translations?.[uiLanguage?.code] ||
                  item.chapterId?.translations?.en
                }
              </p>

              <button className="btn-primary"
                onClick={() => handleStartLearning(item._id)}>
                {t("LearnWords.start")}
              </button>

              <div className="lw-exam">
                <span>{t("LearnWords.exam")}</span>

                <button className="btn-outline">
                  {t("LearnWords.takeExam")}
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default LearnWords;