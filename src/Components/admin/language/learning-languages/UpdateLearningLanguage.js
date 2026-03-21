import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usePageTitle from '../../../../hooks/usePageTitle';
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UpdateLearningLanguage() {
  usePageTitle("Update Learning Language");
  const { id } = useParams();

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    english: "",
    native: "",
    code: "",
    chapters: []
  });
  const [uiLanguages, setUiLanguages] = useState([]);
  useEffect(() => {
    fetchUiLanguages();
    getLanguageById();
  }, [id]);

  const fetchUiLanguages = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/UiLanguageModel/getUiLanguage"
    );

    if (res.data.status === 1) {
      setUiLanguages(res.data.data);
    }
  };


  const getLanguageById = async () => {
    try {

      const res = await axios.get(
        `http://localhost:5000/api/LearningLanguagesModel/getLearningLanguagesById/${id}`
      );

      if (res.data.status === 1) {
        setFormData(res.data.data);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const [errors, setErrors] = useState({});

  /* ---------------- INPUT HANDLERS ---------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChapterChange = (cIndex, lang, value) => {
    const copy = [...formData.chapters];
    copy[cIndex].translations[lang] = value;

    setFormData({
      ...formData,
      chapters: copy,
    });
  };

  const createEmptyTranslations = () => {
    const obj = {};

    uiLanguages.forEach(l => {
      obj[l.code] = "";
    });

    return obj;
  };

  const addChapter = () => {
    setFormData({
      ...formData,
      chapters: [
        ...formData.chapters,
        { translations: createEmptyTranslations() }
      ]
    });
  };

  const removeChapter = (i) => {
    const copy = [...formData.chapters];
    copy.splice(i, 1);

    setFormData({
      ...formData,
      chapters: copy
    });
  };

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {

    let temp = {};

    if (!formData.english?.trim()) {
      temp.english = "Language (English) is required";
    }

    if (!formData.native?.trim()) {
      temp.native = "Language (Native) is required";
    }

    if (!formData.code?.trim()) {
      temp.code = "Language Code is required";
    }

    // validate chapters
    formData.chapters.forEach((ch, cIndex) => {

      uiLanguages.forEach(lang => {

        const value = ch.translations?.[lang.code];

        if (!value || !value.trim()) {
          temp[`ch_${cIndex}_${lang.code}`] = "Required";
        }

      });

    });

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {

      const res = await axios.put(
        `http://localhost:5000/api/LearningLanguagesModel/updateLearningLangauge/${id}`,
        formData
      );

      if (res.data.status === 1) {

        navigate(
          `/admin/language/learning-languages/view-learning-languages/${id}`,
          {
            replace: true,
            state: {
              setMessage: res.data.message,
              setMessageType: "success",
            },
          }
        );

      }

    } catch (err) {
      console.log(err);
    }
  };
  /* ---------------- UI ---------------- */

  return (
    <div className="add-lang-page update-learning-language-page">
      <div className="add-lang-card">

        {/* HEADER */}
        <div className="header-row">

          {/* BACK */}
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <h2>Update Language</h2>

          {/* CLOSE */}
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          {/* LANGUAGE EN */}
          <input
            type="text"
            name="english"
            value={formData.english}
            placeholder="Language (English)"
            onChange={handleChange}
          />
          {errors.languageEn && <p className="error">{errors.languageEn}</p>}

          {/* LANGUAGE NATIVE */}
          <input
            type="text"
            name="native"
            value={formData.native}
            placeholder="Language (Native)"
            onChange={handleChange}
          />
          {errors.languageNative && <p className="error">{errors.languageNative}</p>}

          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Language Code"
          />

          <h4 className="UpdateUpdateLearningLanguageh4">Chapters</h4>

          {formData.chapters.map((ch, cIndex) => (

            <div key={cIndex} className="chapter-row">

              {uiLanguages.map(lang => (

                <input
                  key={lang.code}
                  placeholder={`Chapter ${cIndex + 1} (${lang.code})`}
                  value={ch.translations?.[lang.code] || ""}
                  onChange={(e) =>
                    handleChapterChange(
                      cIndex,
                      lang.code,
                      e.target.value
                    )
                  }
                />

              ))}

              <button
                type="button"
                className="delete-btn"
                onClick={() => removeChapter(cIndex)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>

            </div>

          ))}

          {/* ACTIONS */}
          <div className="action-row">

            <button type="button" className="outline-btn" onClick={addChapter}>
              <svg viewBox="0 0 24 24">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Add Chapter
            </button>

            <button type="submit" className="primary-btn">
              <svg viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
              Update Language
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}
