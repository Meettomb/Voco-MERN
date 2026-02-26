import React, { useState } from "react";
import usePageTitle from "../../../hooks/usePageTitle";
import RichEditor from "../../RichEditor";

const UI_LANGUAGES = ["en", "hi"];

export default function AddMcq() {
  usePageTitle("Add MCQs");
  const [activeLang, setActiveLang] = useState(UI_LANGUAGES[0]);
  const chapters = [
    { id: "1", name: "Chapter 1" },
    { id: "2", name: "Chapter 2" }
  ];

  const createEmptyMcq = () => ({
    difficulty: "",
    question: { en: "", hi: "" },
    options: [
      { en: "", hi: "" },
      { en: "", hi: "" },
      { en: "", hi: "" },
      { en: "", hi: "" }
    ],
    correctAnswer: { en: "", hi: "" }
  });

  const [chapterId, setChapterId] = useState("");
  const [error, setError] = useState("");

  const [mcqs, setMcqs] = useState([createEmptyMcq()]);

  /* ---------- ADD MCQ ---------- */

  const addMcq = () => {
    setMcqs(prev => [...prev, createEmptyMcq()]);
  };

  /* ---------- REMOVE MCQ ---------- */

  const removeMcq = (index) => {
    if (mcqs.length === 1) return;
    setMcqs(mcqs.filter((_, i) => i !== index));
  };

  /* ---------- CHANGE HANDLERS ---------- */

  const handleDifficultyChange = (i, value) => {
    const copy = [...mcqs];
    copy[i].difficulty = value;
    setMcqs(copy);
  };

  const handleQuestionChange = (i, lang, value) => {
    const copy = [...mcqs];
    copy[i].question[lang] = value;
    setMcqs(copy);
  };

  const handleOptionChange = (i, optIndex, lang, value) => {
    const copy = [...mcqs];
    copy[i].options[optIndex][lang] = value;
    setMcqs(copy);
  };

  const handleCorrectChange = (i, lang, value) => {
    const copy = [...mcqs];
    copy[i].correctAnswer[lang] = value;
    setMcqs(copy);
  };

  /* ---------- VALIDATION ---------- */

  const validateForm = () => {
    if (!chapterId) {
      setError("Please select chapter.");
      return;
    }

    for (let mcq of mcqs) {
      if (!mcq.difficulty) {
        setError("Please select difficulty for all MCQs.");
        return;
      }

      for (let lang of UI_LANGUAGES) {

        if (!mcq.question[lang]?.trim()) {
          setError(`Question missing in ${lang.toUpperCase()}.`);
          return;
        }

        const options = mcq.options.map(o => o[lang]?.trim());

        if (options.some(opt => !opt)) {
          setError(`All 4 options required in ${lang.toUpperCase()}.`);
          return;
        }

        const correct = mcq.correctAnswer[lang]?.trim();

        if (!correct) {
          setError(`Correct answer missing in ${lang.toUpperCase()}.`);
          return;
        }

        if (!options.includes(correct)) {
          setError(`Correct answer must match one option in ${lang.toUpperCase()}.`);
          return;
        }
      }
    }

    setError("");
    console.log({ chapterId, mcqs });

    /* RESET FORM */
    setChapterId("");
    setMcqs([createEmptyMcq()]);
    setActiveLang(UI_LANGUAGES[0]);
  };

  return (
    <div className="addmcq-page">
      <div className="addmcq-page__card">

        <h2 className="addmcq-page__title">Add Learning MCQs</h2>

        {error && <div className="addmcq-page__error">{error}</div>}

        {/* Chapter */}
        <div className="addmcq-page__field">
          <label>Select Chapter</label>
          <select value={chapterId} onChange={(e) => setChapterId(e.target.value)}>
            <option value="">Choose Chapter</option>
            {chapters.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* MCQs */}
        {mcqs.map((mcq, i) => (
          <div key={i} className="addmcq-page__mcq-box">

            <div className="addmcq-page__mcq-header">

              <select
                className="addmcq-page__mcq-select-difficulty"
                value={mcq.difficulty}
                onChange={(e) => handleDifficultyChange(i, e.target.value)}
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              {mcqs.length > 1 && (
                <button
                  className="addmcq-page__danger-btn"
                  onClick={() => removeMcq(i)}
                >
                  Remove
                </button>
              )}

            </div>


            <div className="addmcq-page__lang-tabs">
              {UI_LANGUAGES.map(lang => (
                <button
                  key={lang}
                  className={`addmcq-page__lang-tab ${activeLang === lang ? "active" : ""}`}
                  onClick={() => setActiveLang(lang)}
                  type="button"
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Question */}
            {[activeLang].map(lang => (
              <div key={lang} className="addmcq-page__field">
                <label>{lang.toUpperCase()} Question</label>
                <RichEditor
                  value={mcq.question[lang]}
                  onChange={(value) =>
                    handleQuestionChange(i, lang, value)
                  }
                />
              </div>
            ))}

            {/* Options */}
            {mcq.options.map((opt, optIndex) => (
              <div key={optIndex} className="addmcq-page__field">
                <label>
                  {activeLang.toUpperCase()} Option {optIndex + 1}
                </label>
                <input
                  value={opt[activeLang]}
                  onChange={(e) =>
                    handleOptionChange(i, optIndex, activeLang, e.target.value)
                  }
                />
              </div>
            ))}

            {/* Correct Answer */}
            <div className="addmcq-page__field">
              <label>{activeLang.toUpperCase()} Correct Answer</label>
              <select
                value={mcq.correctAnswer[activeLang]}
                onChange={(e) =>
                  handleCorrectChange(i, activeLang, e.target.value)
                }
              >
                <option value="">Select Correct Option</option>
                {mcq.options.map((opt, idx) => (
                  <option key={idx} value={opt[activeLang]}>
                    Option {idx + 1}
                  </option>
                ))}
              </select>
            </div>

          </div>
        ))}

        <button
          className="addmcq-page__add-btn"
          onClick={addMcq}
        >
          <span>+ Add Another MCQ</span>
        </button>

        <button className="addmcq-page__save-btn" onClick={validateForm}>
          Save MCQs
        </button>

      </div>
    </div>
  );
}