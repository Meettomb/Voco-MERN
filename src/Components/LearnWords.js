import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import usePageTitle from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LearnWords() {

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  const { activeLanguage, uiLanguage } = useAuth();
  const { t } = useTranslation();

  usePageTitle("Learn Words");

  const navigate = useNavigate();

  const [chapters, setChapters] = useState([]);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);

  const token = localStorage.getItem("token");

  /*
   * Both requests are independent, so execute them at the same time.
   *
   * This reduces the total waiting time from:
   *
   * Progress API time + Chapters API time
   *
   * to approximately:
   *
   * max(Progress API time, Chapters API time)
   */
useEffect(() => {
    if (!activeLanguage?._id) {
        setChapters([]);
        setCompletedChapters([]);
        setIsCourseCompleted(false);
        return;
    }

    const controller = new AbortController();

    const fetchLearnWordsData = async () => {
        try {
            const languageId = activeLanguage._id;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                signal: controller.signal
            };

            const [progressResponse, chaptersResponse] =
                await Promise.all([
                    axios.get(
                        `${REACT_APP_API_URL}/UserProgressModel/user-progress/${languageId}`,
                        config
                    ),

                    axios.get(
                        `${REACT_APP_API_URL}/LearningWordsModel/getChaptersByLanguage/${activeLanguage._id}`,
                        config
                    )
                ]);

            if (progressResponse.data.status === 1) {
                const progressData = progressResponse.data.data;

                setCompletedChapters(
                    progressData.completedChapters || []
                );

                setIsCourseCompleted(
                    progressData.isCourseCompleted || false
                );
            }

            if (chaptersResponse.data.status === 1) {
                setChapters(chaptersResponse.data.data || []);
            } else {
                setChapters([]);
            }

        } catch (error) {
            if (error.code !== "ERR_CANCELED") {
                console.error(
                    "Failed to load Learn Words data:",
                    error
                );
            }
        }
    };

    fetchLearnWordsData();

    return () => controller.abort();

}, [activeLanguage?._id, REACT_APP_API_URL, token]);


  /*
   * Final exam becomes available when every chapter
   * has been completed.
   */
  const isFinalExamUnlocked =
    chapters.length > 0 &&
    completedChapters.length === chapters.length;


  /*
   * Navigate to the selected learning chapter.
   */
  const handleStartLearning = (chapterId) => {

    navigate(`/learn-chapter/${chapterId}`);
  };


  /*
   * Navigate to a chapter exam.
   *
   * The existing exam timer is reused if one already exists.
   */
  const onHandleNavigateChapterExam = (item, index) => {

    const chapterId = item.chapterId._id;

    const existingEndTime =
      localStorage.getItem("examEndTime");


    const chapterTitle =
      item.chapterId?.translations?.[uiLanguage?.code] ||
      item.chapterId?.translations?.en;


    const chapterNumber = index + 1;


    /*
     * Resume existing exam timer.
     */
    if (existingEndTime) {

      navigate(`/ChapterExam/${chapterId}`, {
        state: {
          chapterTitle,
          chapterNumber,
        },
      });

      return;
    }


    /*
     * Start a new chapter exam timer.
     */
    const examDuration = 10 * 60;

    const endTime =
      Date.now() + examDuration * 1000;


    localStorage.setItem(
      "examEndTime",
      endTime
    );


    navigate(`/ChapterExam/${chapterId}`, {
      state: {
        chapterTitle,
        chapterNumber,
      },
    });
  };


  /*
   * Start or resume the final exam.
   */
  const handleFinalExam = async () => {

  try {

    const chapterTitle = "Final Exam";

    const chapterNumber =
      chapters.length + 1;

    const code = activeLanguage?.code;


    if (!code) {

      alert("Language not selected");

      return;
    }


    /*
     * Get/create the final exam attempt.
     *
     * The backend is responsible for:
     * - creating the attempt
     * - selecting MCQs
     * - generating the 15-minute endTime
     */
    const res = await axios.get(
      `${REACT_APP_API_URL}/ExamAttemptModel/getFinalExamQuestions/${code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    if (res.data.status !== 1 || !res.data.data) {

      console.error(
        "Failed to start final exam:",
        res.data
      );

      return;
    }


    /*
     * Navigate to FinalExam.
     *
     * FinalExam will use the backend endTime
     * to start the timer.
     */
    navigate(`/FinalExam/${code}`, {
      state: {
        chapterTitle,
        chapterNumber,
      },
    });

  } catch (err) {

    console.error(
      "Failed to start final exam:",
      err
    );

    alert("Failed to start final exam");
  }
};


  return (
    <div className="lw-page">

      {isCourseCompleted && (
        <div className="course-completed-banner">
          {t("LearnWords.courseCompleted")}
        </div>
      )}


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

          <div
            className="lw-step"
            key={item._id}
          >

            <div className="lw-dot">
              {index + 1}
            </div>


            <div className="lw-card">

              {/* Chapter Number */}
              <h3>
                {t("LearnWords.chapter", {
                  number: index + 1,
                })}
              </h3>


              {/* Chapter Title */}
              <p>
                {
                  item.chapterId?.translations?.[
                  uiLanguage?.code
                  ] ||
                  item.chapterId?.translations?.en
                }
              </p>


              {/* Start Learning */}
              <button
                className="btn-primary"
                onClick={() =>
                  handleStartLearning(item._id)
                }
              >
                {t("LearnWords.start")}
              </button>


              {/* Chapter Exam */}
              <div className="lw-exam">

                <span>
                  {t("LearnWords.exam")}
                </span>


                <button
                  className="btn-outline"
                  onClick={() =>
                    onHandleNavigateChapterExam(
                      item,
                      index
                    )
                  }
                >
                  {t("LearnWords.takeExam")}
                </button>

              </div>

            </div>

          </div>

        ))}


        {/* FINAL EXAM */}
        <div className="lw-step">

          <div className="lw-dot">
            {chapters.length + 1}
          </div>


          <div className="lw-card">

            <h3>
              {t("LearnWords.chapter", {
                number: chapters.length + 1,
              })}
            </h3>


            <p>
              {t("LearnWords.finalExam") || "Final Exam"}
            </p>


            <button
              className={`btn-primary ${!isFinalExamUnlocked
                ? "locked"
                : ""
                }`}
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

                  <rect
                    x="5"
                    y="11"
                    width="14"
                    height="10"
                    rx="2"
                  />

                  <path
                    d="M8 11V7a4 4 0 118 0v4"
                  />

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