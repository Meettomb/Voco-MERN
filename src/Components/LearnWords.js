import { useTranslation } from "react-i18next";
import usePageTitle from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";

function LearnWords() {

  const { userData, refreshUser, activeLanguage } = useAuth();
  console.log("Active Language in LearnWords:", activeLanguage);
  usePageTitle("Learn Words");
  const { t } = useTranslation();

  const ROADMAP_DATA = [
    { chapterId: 1, hasExam: true },
    { chapterId: 2, hasExam: true },
    { chapterId: 3, hasExam: true }
  ];

  return (
    <div className="lw-page">
      <h1 className="lw-title">
        {t("LearnWords.title")}
      </h1>

      <div className="lw-roadmap">
        {ROADMAP_DATA.map((item) => (
          <div className="lw-step" key={item.chapterId}>

            <div className="lw-dot">
              {item.chapterId}
            </div>

            <div className="lw-card">

              <h3>
                {t("LearnWords.chapter", { number: item.chapterId })}
              </h3>

              <p>
                {t(`LearnWords.chapters.${item.chapterId}.description`)}
              </p>

              <button className="btn-primary">
                {t("LearnWords.start")}
              </button>

              {item.hasExam && (
                <div className="lw-exam">
                  <span>{t("LearnWords.exam")}</span>

                  <button className="btn-outline">
                    {t("LearnWords.takeExam")}
                  </button>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LearnWords;
