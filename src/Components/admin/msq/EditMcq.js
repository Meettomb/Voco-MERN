import React, { useState, useEffect } from "react";
import usePageTitle from "../../../hooks/usePageTitle";
import RichEditor from "../../RichEditor";
import axios from "axios";
import { replace, useNavigate, useParams } from "react-router-dom";
import FullScreenLoader from "../../FullScreenLoader"

export default function EditMcq() {
  usePageTitle("Add MCQs");

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL

  const navigate = useNavigate();
  const { id } = useParams();
  const [uiLanguages, setUiLanguages] = useState([]);
  const [activeLang, setActiveLang] = useState("");

  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");

  const [error, setError] = useState("");

  const [mcqs, setMcqs] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {

    const fetchChapters = async () => {

      const res = await axios.get(
        `${REACT_APP_API_URL}/ChapterModel/getUniqueChapters`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setChapters(res.data.data);

    };

    fetchChapters();

  }, []);

  useEffect(() => {
    if (!id) return;

    fetchMcq();
  }, [id, uiLanguages]);

  const fetchMcq = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${REACT_APP_API_URL}/McqsModel/getMcqsById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (res.data.status === 1) {

        const data = res.data.data;

        setSelectedChapter(
          data.chapterIds?.[0]?.translations?.en
        );

        const mapped = data.questions.map(q => ({

          difficulty: data.difficultyLevel,

          question: q.question,

          options: q.options,

          correctAnswer: {
            en: q.options[q.correctAnswer]?.en,
            hi: q.options[q.correctAnswer]?.hi
          }

        }));

        setMcqs(mapped);

      }

    } catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const fetchLanguages = async () => {

      try {

        const res = await axios.get(
          `${REACT_APP_API_URL}/UiLanguageModel/getUiLanguage`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        const data = res.data.data || [];

        setUiLanguages(data);

        if (data.length > 0) {
          setActiveLang(data[0].code);
        }

      } catch (err) {
        console.log(err);
      }

    };

    fetchLanguages();

  }, []);

  useEffect(() => {

    if (uiLanguages.length > 0 && mcqs.length === 0) {
      setMcqs([createEmptyMcq()]);
    }

  }, [uiLanguages]);

  const createEmptyMcq = () => {

    const question = {};
    const correctAnswer = {};
    const options = [];

    uiLanguages.forEach(lang => {
      question[lang.code] = "";
      correctAnswer[lang.code] = "";
    });

    for (let i = 0; i < 4; i++) {

      const opt = {};

      uiLanguages.forEach(lang => {
        opt[lang.code] = "";
      });

      options.push(opt);
    }

    return {
      difficulty: "",
      question,
      options,
      correctAnswer
    };

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

  const validateForm = async () => {

    if (!selectedChapter) {
      setError("Please select chapter.");
      return;
    }

    for (let mcq of mcqs) {

      if (!mcq.difficulty) {
        setError("Please select difficulty for all MCQs.");
        return;
      }

      for (let lang of uiLanguages) {

        const code = lang.code;

        if (!mcq.question[code]?.trim()) {
          setError(`Question missing in ${lang.code.toUpperCase()}.`);
          return;
        }

        const options = mcq.options.map(o => o[code]?.trim());

        if (options.some(opt => !opt)) {
          setError(`All 4 options required in ${lang.code.toUpperCase()}.`);
          return;
        }

        const correct = mcq.correctAnswer[code]?.trim();

        if (!correct) {
          setError(`Correct answer missing in ${lang.code.toUpperCase()}.`);
          return;
        }

        if (!options.includes(correct)) {
          setError(
            `Correct answer must match one option in ${lang.code.toUpperCase()}.`
          );
          return;
        }

      }
    }

    const selectedName = selectedChapter;

    const chapterObj = chapters.find(
      c => c.name === selectedName
    );

    const chapterIds = chapterObj?.ids || [];

    try {
      setSaving(true);
      const res = await axios.patch(
        `${REACT_APP_API_URL}/McqsModel/updateMcqsById/${id}`,
        {
          chapterId: chapterIds,
          mcqs
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (res.data.status === 1) {

        setError("");

        navigate(`/admin/mcq/view/${id}`, {
          state: {
            replace: true,
            message: "MCQ updated successfully",
            type: "success"
          }
        });

        /* RESET FORM ONLY ON SUCCESS */

        setSelectedChapter("");
        setMcqs([createEmptyMcq()]);
        setActiveLang(uiLanguages[0]?.code || "");

      } else {

        setMessage("Failed to add MCQ");
        setMessageType("error");

      }

    } catch (error) {

      console.log(error);

      setMessage("Server error");
      setMessageType("error");

    } finally {
      setSaving(false);
    }

  };
  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      {saving && <FullScreenLoader />}
      {message && (
        <p
          className={`app-message ${messageType === "success" ? "success" : "error"
            }`}
        >
          {message}
        </p>
      )}

      <div className="addmcq-page">
        <div className="addmcq-page__card">

          <div className="addmcq-page__header">

            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <h2 className="addmcq-page__title">
              Update Learning MCQs
            </h2>

          </div>

          {error && <div className="addmcq-page__error">{error}</div>}

          {/* Chapter */}
          <div className="addmcq-page__field">
            <label>Select Chapter</label>
            <select
              value={selectedChapter || ""}
              onChange={(e) => setSelectedChapter(e.target.value)}
            >
              <option value="">Choose Chapter</option>

              {chapters.map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name}
                </option>
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
                {uiLanguages.map(lang => (
                  <button
                    key={lang.code}
                    className={`addmcq-page__lang-tab ${activeLang === lang.code ? "active" : ""
                      }`}
                    onClick={() => setActiveLang(lang.code)}
                    type="button"
                  >
                    {lang.code.toUpperCase()}
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

          {/* <button
          className="addmcq-page__add-btn"
          onClick={addMcq}
        >
          <span>+ Add Another MCQ</span>
        </button> */}

          <button className="addmcq-page__save-btn" onClick={validateForm}>
            Update MCQs
          </button>

          <button className="addmcq-page__cancle-btn" onClick={() => navigate(-1)}>
            Cancle
          </button>

        </div>
      </div>
    </>
  );
}