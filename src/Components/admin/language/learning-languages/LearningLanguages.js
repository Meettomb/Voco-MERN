import { useState } from "react";
import usePageTitle from "../../../../hooks/usePageTitle";

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

/* ================= COMPONENT ================= */

export default function LearningLanguages() {
  usePageTitle("Add Learning Languages");

  /* -------- STATES -------- */

  const [formData, setFormData] = useState({
    english: "",
    native: "",
    chapters: [{ translations: { en: "", hi: "" } }]
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
      chapters: [...formData.chapters, { translations: { en: "", hi: "" } }]
    });
  };

  const removeChapterField = (index) => {
    if (formData.chapters.length === 1) return;

    setFormData({
      ...formData,
      chapters: formData.chapters.filter((_, i) => i !== index)
    });
  };

  /* -------- ADD LANGUAGE (VALIDATE + CONSOLE JSON) -------- */

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

    const payload = {
      english: formData.english,
      native: formData.native,
      chapters: formData.chapters
    };

    console.log(payload);

    // Reset form
    setFormData({
      english: "",
      native: "",
      chapters: [{ translations: { en: "", hi: "" } }]
    });

    setError("");
  };

  /* ================= UI ================= */

  return (
    <div className="learning-languages-page">

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

    </div>
  );
}
