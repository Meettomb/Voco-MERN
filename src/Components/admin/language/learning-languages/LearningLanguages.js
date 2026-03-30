import { useEffect, useState } from "react";
import usePageTitle from "../../../../hooks/usePageTitle";
import axios from "axios";

/* ================= UI LANGUAGES ================= */

// const UI_LANGUAGES = ["en", "hi"];

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
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [error, setError] = useState("");
  const [uiLanguages, setUiLanguages] = useState([]);
  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/UiLanguageModel/getUiLanguage",
        {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      );

      if (res.data.status === 1) {
        setUiLanguages(res.data.data);
      }

    } catch (err) {
      console.log(err);
    }
  };
  const createEmptyTranslations = (langs) => {
    const obj = {};
    langs.forEach(l => {
      obj[l.code] = "";
    });
    return obj;
  };


  const [formData, setFormData] = useState({
    english: "",
    native: "",
    code: "",
    chapters: []
  });

  useEffect(() => {
    if (uiLanguages.length > 0) {
      setFormData({
        english: "",
        native: "",
        code: "",
        chapters: [
          { translations: createEmptyTranslations(uiLanguages) }
        ]
      });
    }
  }, [uiLanguages]);

  useEffect(() => {

    if (message) {

      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);

      return () => clearTimeout(timer);
    }

  }, [message]);

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
        { translations: createEmptyTranslations(uiLanguages) }
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

  /* -------- ADD LANGUAGE (VALIDATE + CONSOLE JSON) -------- */

  const addLanguage = async () => {

    if (!formData.english.trim())
      return setError("Enter language English name");

    if (!formData.native.trim())
      return setError("Enter language Native name");

    if (!formData.code.trim())
      return setError("Enter language Code");

    for (let ch of formData.chapters) {
      for (let lang of uiLanguages) {
        if (!ch.translations[lang.code].trim()) {
          return setError("Fill all chapter language fields");
        }
      }
    }

    const payload = {
      english: formData.english,
      native: formData.native,
      code: formData.code,
      chapters: formData.chapters
    };

    try {

      const response = await axios.post(
        "http://localhost:5000/api/LearningLanguagesModel/addLearningLanguages",
        payload,
        {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
         }
      );

      if (response?.data?.status === 1) {

        setMessage(response.data.message);
        setMessageType("success");

        // ✅ reset only on success
        setFormData({
          english: "",
          native: "",
          code: "",
          chapters: [
            {
              translations: createEmptyTranslations(uiLanguages)
            }
          ]
        });

        setError("");

      } else {

        setMessage(response.data.message || "Failed to add learning language");
        setMessageType("error");

      }

    } catch (error) {

      console.error("Error adding language:", error);

      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Server error");
      }

      setMessageType("error");

    }
  };

  /* ================= UI ================= */

  return (
    <>
      {message && (
        <p
          className={`app-message ${messageType === "success" ? "success" : "error"
            }`}
        >
          {message}
        </p>
      )}

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
            name="english"
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
          <input
            placeholder="Language Code"
            value={formData.code}
            onChange={e =>
              setFormData({ ...formData, code: e.target.value })
            }
          />

          <h4>Chapters</h4>

          {formData.chapters.map((chapter, cIndex) => (

            <div key={cIndex} className="learning-languages-page__chapter-box">

              {uiLanguages.map(lang => (

                <input
                  key={lang.code}
                  placeholder={`Chapter ${cIndex + 1} (${lang.code})`}
                  value={chapter.translations[lang.code]}
                  onChange={(e) =>
                    handleChapterChange(cIndex, lang.code, e.target.value)
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
    </>
  );
}
