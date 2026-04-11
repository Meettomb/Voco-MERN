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
  const [completedChapters, setCompletedChapters] = useState([]);
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          `${REACT_APP_API_URL}/UserProgressModel/user-progress/${activeLanguage?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.status === 1) {
          setCompletedChapters(res.data.data.completedChapters || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (activeLanguage?._id) {
      fetchProgress();
    }
  }, [activeLanguage]);

  const isFinalExamUnlocked =
    completedChapters.length === chapters.length;


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

  const onHandleNavigateChapterExam = (item, index) => {
    const chapterId = item.chapterId._id;

    const existingEndTime = localStorage.getItem("examEndTime");

    const chapterTitle =
      item.chapterId?.translations?.[uiLanguage?.code] ||
      item.chapterId?.translations?.en;

    const chapterNumber = index + 1;

    // If timer already exists → DON'T reset
    if (existingEndTime) {
      navigate(`/ChapterExam/${chapterId}`, {
        state: {
          chapterTitle,
          chapterNumber
        }
      });
      return;
    }

    // Otherwise start new timer
    const examDuration = 10 * 60;
    const endTime = Date.now() + examDuration * 1000;

    localStorage.setItem("examEndTime", endTime);

    navigate(`/ChapterExam/${chapterId}`, {
      state: {
        chapterTitle,
        chapterNumber
      }
    });
  };

  const handleFinalExam = async () => {
    try {
      const existingEndTime = localStorage.getItem("examEndTime");

      const chapterTitle = "Final Exam";
      const chapterNumber = chapters.length + 1;

      const code = activeLanguage?.code;

      if (!code) {
        alert("Language not selected");
        return;
      }

      // Call backend to start/resume exam
      const res = await axios.get(
        `${REACT_APP_API_URL}/ExamAttemptModel/getFinalExamQuestions/${code}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // If timer already exists → don't reset
      if (existingEndTime) {
        navigate(`/FinalExam/${code}`, {
          state: {
            chapterTitle,
            chapterNumber,
          },
        });
        return;
      }

      // Use backend endTime (BEST PRACTICE)
      const endTime = new Date(res.data.data.endTime).getTime();
      localStorage.setItem("examEndTime", endTime);

      navigate(`/FinalExam/${code}`, {
        state: {
          chapterTitle,
          chapterNumber,
        },
      });

    } catch (err) {
      console.error(err);
      alert("Failed to start final exam");
    }
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
                  onClick={() => onHandleNavigateChapterExam(item, index)}>
                  {t("LearnWords.takeExam")}
                </button>
              </div>

            </div>

          </div>
        ))}

        {/* FINAL EXAM (STATIC) */}
        <div className="lw-step">

          <div className="lw-dot">
            {chapters.length + 1}
          </div>

          <div className="lw-card">
            <h3>
              {t("LearnWords.chapter", { number: chapters.length + 1 })}
            </h3>

            <p>
              {t("LearnWords.finalExam") || "Final Exam"}
            </p>

            <button
              className={`btn-primary ${!isFinalExamUnlocked ? "locked" : ""}`}
              onClick={handleFinalExam}
              disabled={!isFinalExamUnlocked}
            >
              {!isFinalExamUnlocked && (
                <svg
                  className="lock-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 118 0v4" />
                </svg>
              )}

              <span>
                {isFinalExamUnlocked
                  ? t("LearnWords.start")
                  : "Complete all chapters first"}
              </span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default LearnWords;