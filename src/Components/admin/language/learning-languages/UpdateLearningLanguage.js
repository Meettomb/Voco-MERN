import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usePageTitle from '../../../../hooks/usePageTitle';

export default function UpdateLearningLanguage() {  
  usePageTitle("Update Learning Language");

  const navigate = useNavigate();
  const location = useLocation();

  const existingData = location.state?.language || {
    languageEn: "",
    languageNative: "",
    chapters: [{ en: "", native: "" }]
  };

  const [formData, setFormData] = useState(existingData);
  const [errors, setErrors] = useState({});

  /* ---------------- INPUT HANDLERS ---------------- */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChapterChange = (i, field, value) => {
    const updated = [...formData.chapters];
    updated[i][field] = value;
    setFormData({ ...formData, chapters: updated });
  };

  const addChapter = () => {
    setFormData({
      ...formData,
      chapters: [...formData.chapters, { en: "", native: "" }]
    });
  };

  const removeChapter = (i) => {
    const updated = [...formData.chapters];
    updated.splice(i, 1);
    setFormData({ ...formData, chapters: updated });
  };

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    let temp = {};

    if (!formData.languageEn.trim())
      temp.languageEn = "Language (English) is required";

    if (!formData.languageNative.trim())
      temp.languageNative = "Language (Native) is required";

    formData.chapters.forEach((c, i) => {
      if (!c.en.trim()) temp[`chEn${i}`] = "Required";
      if (!c.native.trim()) temp[`chNative${i}`] = "Required";
    });

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Updated Data:", formData);
    navigate(-1);
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
            name="languageEn"
            placeholder="Language (English)"
            value={formData.languageEn}
            onChange={handleChange}
          />
          {errors.languageEn && <p className="error">{errors.languageEn}</p>}

          {/* LANGUAGE NATIVE */}
          <input
            type="text"
            name="languageNative"
            placeholder="Language (Native)"
            value={formData.languageNative}
            onChange={handleChange}
          />
          {errors.languageNative && <p className="error">{errors.languageNative}</p>}

          <h4 className="UpdateUpdateLearningLanguageh4">Chapters</h4>

          {formData.chapters.map((ch, i) => (
            <div key={i} className="chapter-row">

              <input
                type="text"
                placeholder={`Chapter ${i + 1} (en)`}
                value={ch.en}
                onChange={(e) =>
                  handleChapterChange(i, "en", e.target.value)
                }
              />
              {errors[`chEn${i}`] && <p className="error">{errors[`chEn${i}`]}</p>}

              <input
                type="text"
                placeholder={`Chapter ${i + 1} (native)`}
                value={ch.native}
                onChange={(e) =>
                  handleChapterChange(i, "native", e.target.value)
                }
              />
              {errors[`chNative${i}`] && <p className="error">{errors[`chNative${i}`]}</p>}

              {formData.chapters.length > 1 && (
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeChapter(i)}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M3 6h18" />
                    <path d="M8 6v14" />
                    <path d="M16 6v14" />
                    <path d="M5 6l1-2h12l1 2" />
                  </svg>
                </button>
              )}

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
