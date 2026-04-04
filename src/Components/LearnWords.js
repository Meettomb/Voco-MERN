import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import usePageTitle from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LearnWords() {

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL
  const { activeLanguage, uiLanguage } = useAuth();
  const { t } = useTranslation();
  usePageTitle("Learn Words");
  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await axios.get(
          `${REACT_APP_API_URL}/LearningWordsModel/getLearningWords`,
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
    navigate(`/learn-chapter/${chapterId}`);
  }

  const onHandleNavigateChapterExam = (chapterId) => {
    const existingEndTime = localStorage.getItem("examEndTime");

    // ✅ If timer already exists → DON'T reset
    if (existingEndTime) {
      navigate(`/ChapterExam/${chapterId}`);
      return;
    }

    // ✅ Otherwise start new timer
    const examDuration = 10 * 60; // 10 min
    const endTime = Date.now() + examDuration * 1000;

    localStorage.setItem("examEndTime", endTime);

    navigate(`/ChapterExam/${chapterId}`);
  };

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

                <button className="btn-outline"
                  onClick={() => onHandleNavigateChapterExam(item.chapterId._id)}>
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