import React, { useState } from "react";
import usePageTitle from '../../../hooks/usePageTitle';

const UI_LANGUAGES = ["en", "fr"];

export default function EditWords() {
  usePageTitle("Edit Learn Words");
  const PlusIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M12 5V19" />
      <path d="M5 12H19" />
    </svg>
  );

  const TrashIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
    </svg>
  );

  const CloseIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M6 6L18 18" />
      <path d="M6 18L18 6" />
    </svg>
  );

  const [chapterId, setChapterId] = useState("1");

  const [learnWords, setLearnWords] = useState([
    {
      difficulty: "medium",
      words: [{ translations: { en: "Thanks", fr: "Merci" } }]
    }
  ]);

  const [error, setError] = useState("");

  /* ---------- ADD ---------- */

  const addDifficulty = () => {
    setLearnWords([
      ...learnWords,
      { difficulty: "", words: [{ translations: { en: "", fr: "" } }] }
    ]);
  };

  const addWord = (dIndex) => {
    const copy = [...learnWords];
    copy[dIndex].words.push({ translations: { en: "", fr: "" } });
    setLearnWords(copy);
  };

  /* ---------- REMOVE ---------- */

  const removeDifficulty = (dIndex) => {
    if (learnWords.length === 1) return;
    setLearnWords(learnWords.filter((_, i) => i !== dIndex));
  };

  const removeWord = (dIndex, wIndex) => {
    const copy = [...learnWords];
    if (copy[dIndex].words.length === 1) return;
    copy[dIndex].words.splice(wIndex, 1);
    setLearnWords(copy);
  };

  /* ---------- CHANGE ---------- */

  const handleDifficultyChange = (i, value) => {
    const copy = [...learnWords];
    copy[i].difficulty = value;
    setLearnWords(copy);
  };

  const handleWordChange = (d, w, lang, value) => {
    const copy = [...learnWords];
    copy[d].words[w].translations[lang] = value;
    setLearnWords(copy);
  };

  /* ---------- VALIDATION ---------- */

  const validateForm = () => {

    if (!chapterId) {
      setError("Please select chapter.");
      return;
    }

    for (let d of learnWords) {

      if (!d.difficulty) {
        setError("Please select difficulty for all groups.");
        return;
      }

      for (let w of d.words) {
        for (let lang of UI_LANGUAGES) {
          if (!w.translations[lang]) {
            setError("Please fill all word fields.");
            return;
          }
        }
      }
    }

    setError("");
    console.log("VALID DATA:", { chapterId, learnWords });
    window.history.back();
  };

  return (
    <div className="editwords-page">
      <div className="editwords-page__card">

        {/* Header */}
        <div className="editwords-page__header">
          <button
            className="editwords-page__back-btn"
            onClick={() => window.history.back()}
          >
            ← Cancel
          </button>

          <h2>Edit Learn Words</h2>
        </div>

        {/* Error */}
        {error && (
          <div className="editwords-page__error">
            {error}
          </div>
        )}

        {/* Chapter */}
        <div className="editwords-page__field">
          <label>Chapter</label>
          <select
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
          >
            <option value="">Choose Chapter</option>
            <option value="1">Chapter 1</option>
            <option value="2">Chapter 2</option>
          </select>
        </div>

        {/* Difficulties */}
        {learnWords.map((diff, dIndex) => (
          <div key={dIndex} className="editwords-page__difficulty-box">

            <div className="editwords-page__difficulty-header">

              <select
                value={diff.difficulty}
                onChange={(e) =>
                  handleDifficultyChange(dIndex, e.target.value)
                }
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <button
                className="editwords-page__add-btn"
                onClick={() => addWord(dIndex)}
              >
                <PlusIcon /> Add Word
              </button>

              {learnWords.length > 1 && (
                <button
                  className="editwords-page__icon-btn danger"
                  onClick={() => removeDifficulty(dIndex)}
                >
                  <TrashIcon />
                </button>
              )}

            </div>

            {diff.words.map((word, wIndex) => (
              <div key={wIndex} className="editwords-page__word-row">

                {UI_LANGUAGES.map(lang => (
                  <input
                    key={lang}
                    placeholder={`${lang.toUpperCase()} Word`}
                    value={word.translations[lang]}
                    onChange={(e) =>
                      handleWordChange(dIndex, wIndex, lang, e.target.value)
                    }
                  />
                ))}

              {learnWords[dIndex].words.length > 1 && (

                <button
                className="editwords-page__icon-btn danger"
                onClick={() => removeWord(dIndex, wIndex)}
                >
                  <CloseIcon />
                </button>
                )}

              </div>
            ))}

          </div>
        ))}

        <button
          className="editwords-page__add-btn"
          onClick={addDifficulty}
        >
          <PlusIcon /> Add Difficulty
        </button>

        <button
          className="editwords-page__save-btn"
          onClick={validateForm}
        >
          Update Words
        </button>

      </div>
    </div>
  );
}
