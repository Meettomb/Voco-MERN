import { useTranslation } from "react-i18next";
// import "./LearnWords.css";

function LearnWords() {
  const { t } = useTranslation();

  const ROADMAP_DATA = [
    {
      chapterId: 1,
      title: "Chapter 1",
      description: "Basic everyday words",
      hasExam: true,
    },
    {
      chapterId: 2,
      title: "Chapter 2",
      description: "Common phrases & usage",
      hasExam: true,
    },
    {
      chapterId: 3,
      title: "Chapter 3",
      description: "Advanced vocabulary",
      hasExam: true,
    },
  ];


  return (
    <div className="lw-page">
      <h1 className="lw-title">Learn Words</h1>

      <div className="lw-roadmap">
        {ROADMAP_DATA.map((item) => (
          <div className="lw-step" key={item.chapterId}>
            <div className="lw-dot">{item.chapterId}</div>

            <div className="lw-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <button className="btn-primary">
                Start Chapter
              </button>

              {item.hasExam && (
                <div className="lw-exam">
                  <span>Chapter Exam</span>
                  <button className="btn-outline">
                    Take Exam
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

