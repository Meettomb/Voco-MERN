import { useState } from "react";

/* ================= UI LANGUAGES ================= */

const UI_LANGUAGES = ["en", "hi"];

/* ================= SVG ICONS ================= */

const PlusIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 5V19" />
    <path d="M5 12H19" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/* ================= COMPONENT ================= */

export default function LearningLanguages() {

  /* -------- STATES -------- */

  const [languages, setLanguages] = useState([]);

  const [formData, setFormData] = useState({
    english: "",
    native: "",
    chapters: [
      { translations: { en: "", hi: "" } }
    ]
  });

  const [error, setError] = useState("");

  /* -------- CHAPTER CHANGE -------- */

  const handleChapterChange = (cIndex, lang, value) => {
    const copy = [...formData.chapters];
    copy[cIndex].translations[lang] = value;
    setFormData({ ...formData, chapters: copy });
    setError("");
  };

  /* -------- ADD / REMOVE CHAPTER -------- */

  const addChapterField = () => {
    setFormData({
      ...formData,
      chapters: [
        ...formData.chapters,
        { translations: { en: "", hi: "" } }
      ]
    });
  };

  const removeChapterField = (index) => {
    if (formData.chapters.length === 1) return;

    setFormData({
      ...formData,
      chapters: formData.chapters.filter((_, i) => i !== index)
    });
  };

  /* -------- ADD LANGUAGE -------- */

  const addLanguage = () => {

    if (!formData.english.trim())
      return setError("Enter language English name");

    if (!formData.native.trim())
      return setError("Enter language Native name");

    for (let ch of formData.chapters) {
      for (let lang of UI_LANGUAGES) {
        if (!ch.translations[lang].trim()) {
          return setError("Fill all chapter language fields");
        }
      }
    }

    setLanguages([
      ...languages,
      {
        id: Date.now(),
        english: formData.english,
        native: formData.native,
        chapters: formData.chapters
      }
    ]);

    setFormData({
      english: "",
      native: "",
      chapters: [
        { translations: { en: "", hi: "" } }
      ]
    });

    setError("");
  };

  /* -------- REMOVE LANGUAGE -------- */

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  /* ================= UI ================= */

  return (
    <div className="learning-languages-page">

      {/* ================= ADD FORM ================= */}

      <div className="learning-languages-page__card">

        <h2>Add New Language</h2>

        {error && (
          <div className="learning-languages-page__error">
            {error}
          </div>
        )}

        <input
          placeholder="Language (English)"
          value={formData.english}
          onChange={e =>
            setFormData({ ...formData, english: e.target.value })
          }
        />

        <input
          placeholder="Language (Native)"
          value={formData.native}
          onChange={e =>
            setFormData({ ...formData, native: e.target.value })
          }
        />

        <h4>Chapters</h4>

        {formData.chapters.map((chapter, cIndex) => (

          <div key={cIndex} className="learning-languages-page__chapter-box">

            {UI_LANGUAGES.map(lang => (

              <input
                key={lang}
                placeholder={`Chapter ${cIndex + 1} (${lang})`}
                value={chapter.translations[lang]}
                onChange={(e) =>
                  handleChapterChange(cIndex, lang, e.target.value)
                }
              />

            ))}

            <button
              className="learning-languages-page__icon-btn learning-languages-page__icon-btn--danger"
              onClick={() => removeChapterField(cIndex)}
            >
              <TrashIcon />
            </button>

          </div>

        ))}

        <div className="learning-languages-page__form-actions">

          <button
            className="learning-languages-page__secondary-btn"
            onClick={addChapterField}
          >
            <PlusIcon /> Add Chapter
          </button>

          <button
            className="learning-languages-page__primary-btn"
            onClick={addLanguage}
          >
            Add Language
          </button>

        </div>

      </div>

      {/* ================= TABLE ================= */}

      {languages.length > 0 && (

        <div className="learning-languages-page__card">

          <h3>Languages</h3>

          <table className="learning-languages-page__table">

            <thead>
              <tr>
                <th>#</th>
                <th>English</th>
                <th>Native</th>
                <th>Chapters</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {languages.map((lang, index) => (

                <tr key={lang.id}>

                  <td>{index + 1}</td>
                  <td>{lang.english}</td>
                  <td>{lang.native}</td>
                  <td>{lang.chapters.length}</td>

                  <td className="learning-languages-page__actions">

                    <button className="learning-languages-page__view-btn">
                      <EyeIcon /> View
                    </button>

                    <button
                      className="learning-languages-page__icon-btn learning-languages-page__icon-btn--danger"
                      onClick={() => removeLanguage(index)}
                    >
                      <TrashIcon />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}
