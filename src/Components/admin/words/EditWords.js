import React, { useState, useEffect } from "react";
import axios from "axios";
import usePageTitle from '../../../hooks/usePageTitle';
import RichEditor from "../../RichEditor";
import FullScreenLoader from "../../FullScreenLoader";
import { useParams, useNavigate } from "react-router-dom";

// const UI_LANGUAGES = ["en", "hi"];

export default function EditWords() {

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contentType, setContentType] = useState("text");
  // "text" | "textarea"
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [uiLanguages, setUiLanguages] = useState([]);
  const [grammarContent, setGrammarContent] = useState({});

  const [isAllLanguage, setIsAllLanguage] = useState(false);
  const [newChapter, setNewChapter] = useState({});


  // const [chapters, setChapters] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [languageId, setLanguageId] = useState("");

  const createEmptyTranslations = () => {
    const obj = {};

    uiLanguages.forEach(lang => {
      obj[lang] = "";
    });

    return obj;
  };
  useEffect(() => {

    if (message) {

      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);

      return () => clearTimeout(timer);
    }

  }, [message]);

  useEffect(() => {

    const getLanguages = async () => {

      try {

        const res = await axios.get(
          `${REACT_APP_API_URL}/LearningLanguagesModel/getAllLearningLanguages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (res.data.status === 1) {

          setLanguages(res.data.data);

        }

      } catch (error) {
        console.log(error);
      }

    };

    getLanguages();

  }, []);

  useEffect(() => {

    if (!id) return;

    const loadData = async () => {

      try {

        setLoading(true);

        const res = await axios.get(
          `${REACT_APP_API_URL}/LearningWordsModel/getLearningWords`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        const word = res.data.data.find(
          w => w._id === id
        );

        if (!word) return;

        setChapterId(word.chapterId?._id || word.chapterId);
        setLanguageId(word.learningWordsLangauge?._id || word.learningWordsLangauge);

        setContentType(
          word.contentType === "TextArea"
            ? "textarea"
            : "text"
        );

        // TEXTAREA
        if (word.contentType === "TextArea") {

          setGrammarContent(word.grammarContent);

        }

        // TEXTBLOCK
        if (word.contentType === "TextBlock") {

          const diffs = word.difficulties.map(d => ({
            difficulty: d.level,
            words: d.words.map(w => ({
              translations: w
            }))
          }));

          setLearnWords(diffs);

        }

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

    loadData();

  }, [id]);

  const handleLanguageChange = (id) => {

    setLanguageId(id);

    if (id === "all") {

      setIsAllLanguage(true);
      setChapters([]);

      const obj = {};

      uiLanguages.forEach(l => {
        obj[l] = "";
      });

      setNewChapter(obj);

      return;
    }

    setIsAllLanguage(false);

    const lang = languages.find(l => l._id === id);

    if (lang) {
      setChapters(lang.chapters);
    } else {
      setChapters([]);
    }

  };


  useEffect(() => {

    const getUiLanguages = async () => {

      try {

        const res = await axios.get(
          `${REACT_APP_API_URL}/UiLanguageModel/getUiLanguage`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (res.data.status === 1) {

          // assuming language has code field
          const codes = res.data.data.map(l => l.code);

          setUiLanguages(codes);

        }

      } catch (error) {
        console.log(error);
      }

    };

    getUiLanguages();

  }, []);

  useEffect(() => {

    if (uiLanguages.length === 0) return;

    setGrammarContent(prev => {
      // 🔥 If already has data (edit mode), don't overwrite
      if (Object.keys(prev).length > 0) {
        return prev;
      }

      const grammarObj = {};

      uiLanguages.forEach(lang => {
        grammarObj[lang] = "";
      });

      return grammarObj;
    });

    setLearnWords(prev => {
      // 🔥 Don't overwrite if already loaded from API
      if (prev.length > 0) {
        return prev;
      }

      const grammarObj = {};
      uiLanguages.forEach(lang => {
        grammarObj[lang] = "";
      });

      return [
        {
          difficulty: "",
          words: [
            {
              translations: { ...grammarObj }
            }
          ]
        }
      ];
    });

  }, [uiLanguages]);


  useEffect(() => {

    if (!languageId) return;

    const lang = languages.find(
      l => l._id === languageId
    );

    if (lang) {
      setChapters(lang.chapters);
    }

  }, [languageId, languages]);



  usePageTitle("Edit Words");
  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" />
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

  const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18" stroke="currentColor" strokeWidth="2" />
      <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="2" />
      <path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

  const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" />
      <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );




  const [chapterId, setChapterId] = useState("");
  const [learnWords, setLearnWords] = useState([]);

  const [error, setError] = useState("");



  /* ---------------- ADD ---------------- */

  const addDifficulty = () => {

    setLearnWords([
      ...learnWords,
      {
        difficulty: "",
        words: [
          { translations: createEmptyTranslations() }
        ]
      }
    ]);

  };

  const addWord = (dIndex) => {

    const copy = [...learnWords];

    copy[dIndex].words.push({
      translations: createEmptyTranslations()
    });

    setLearnWords(copy);

  };

  /* ---------------- REMOVE ---------------- */

  const removeDifficulty = (dIndex) => {
    if (learnWords.length === 1) return;   // Prevent removing the last remaining difficulty
    setLearnWords(learnWords.filter((_, i) => i !== dIndex));  // Keep all difficulties except the one at dIndex
    // _ means: element not needed 
    // i is index
  };

  const removeWord = (dIndex, wIndex) => {
    const copy = [...learnWords];  // Create copy of state
    if (copy[dIndex].words.length === 1) return;
    copy[dIndex].words.splice(wIndex, 1);  // Remove 1 word at position wIndex
    setLearnWords(copy);  // Save updated data
  };

  /* ---------------- CHANGE ---------------- */

  const handleDifficultyChange = (i, value) => {
    const copy = [...learnWords];
    copy[i].difficulty = value;  // Set new difficulty value
    setLearnWords(copy);
  };

  const handleWordChange = (d, w, lang, value) => {
    const copy = [...learnWords];
    copy[d].words[w].translations[lang] = value; // Update selected language value
    setLearnWords(copy);
  };

  // Handle grammar content change
  const handleGrammarChange = (lang, value) => {
    setGrammarContent(prev => ({
      ...prev,
      [lang]: value
    }));
  };

  /* ---------------- VALIDATE ---------------- */

  const validateForm = async () => {
    // console.log("submit clicked");
    if (loading) return;
    if (!languageId) {
      setError("Please select language");
      return;
    }

    if (!isAllLanguage && !chapterId) {
      setError("Please select a chapter.");
      return;
    }

    // ALL LANGUAGE VALIDATION
    if (isAllLanguage) {

      for (let lang of uiLanguages) {

        if (!newChapter[lang] || !newChapter[lang].trim()) {
          setError("Fill all chapter names");
          return;
        }

      }

    }

    // TEXTAREA validation
    const cleanText = (html = "") => {
      return html.replace(/<[^>]*>/g, "").trim();
    };

    if (contentType === "textarea") {
      for (let lang of uiLanguages) {
        const value = grammarContent[lang] || "";

        if (!cleanText(value)) {
          setError(`Please fill grammar field (${lang})`);
          return;
        }
      }
    }
    // TEXT BLOCK validation
    if (contentType === "text") {

      if (learnWords.length === 0) {
        setError("Add at least one difficulty.");
        return;
      }

      for (let d of learnWords) {

        if (!d.difficulty) {
          setError("Please select difficulty.");
          return;
        }

        for (let w of d.words) {

          for (let lang of uiLanguages) {

            if (!w.translations[lang] || !w.translations[lang].trim()) {
              setError(`Fill all language words (${lang})`);
              return;
            }

          }

        }

      }

    }

    setError("");
    setLoading(true);

    try {

      let formData = new FormData();

      let finalChapterId = chapterId;
      let finalLanguageId = languageId;

      //  IMPORTANT
      formData.append("isAllLanguage", isAllLanguage);
      formData.append(
        "translations",
        JSON.stringify(newChapter)
      );

      formData.append("chapterId", finalChapterId);
      formData.append(
        "learningWordsLangauge",
        finalLanguageId
      );

      // TEXT BLOCK
      if (contentType === "text") {

        formData.append("contentType", "TextBlock");

        const difficulties = learnWords.map(d => ({
          level: d.difficulty,
          words: d.words.map(w => ({
            ...w.translations
          }))
        }));

        formData.append(
          "difficulties",
          JSON.stringify(difficulties)
        );

      }

      // TEXTAREA
      if (contentType === "textarea") {

        formData.append("contentType", "TextArea");

        formData.append(
          "grammarContent",
          JSON.stringify(grammarContent)
        );

      }

      const response = await axios.put(
        `${REACT_APP_API_URL}/LearningWordsModel/updateLearningWordById/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.status === 1) {

        navigate(-1, {
          replace: true,
          state: {
            message: "Updated successfully",
            type: "success"
          }
        });

        resetForm();

      } else {

        setMessage(response.data.message);
        setMessageType("error");

      }
      

    } catch (error) {

      console.log(error);

      setMessage("Server error");
      setMessageType("error");

    } finally {

      setLoading(false);

    }

  };
  const resetForm = () => {

    setChapterId("");
    setContentType("text");

    // reset grammar
    const grammarObj = {};

    uiLanguages.forEach(lang => {
      grammarObj[lang] = "";
    });

    setGrammarContent(grammarObj);

    // reset words
    setLearnWords([
      {
        difficulty: "",
        words: [
          {
            translations: { ...grammarObj }
          }
        ]
      }
    ]);

  };

  return (
    <>
      {loading && <FullScreenLoader />}
      {message && (
        <p
          className={`app-message ${messageType === "success" ? "success" : "error"
            }`}
        >
          {message}
        </p>
      )}

      <div className="addwords-page">
        <div className="addwords-page__card">

          <h2 className="addwords-page__title">Edit Words</h2>

          {error && <div className="addwords-page__error">{error}</div>}

          {/* Leangauge */}
          <div className="addwords-page__field">
            <label>Select Language</label>

            <select
              value={languageId}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >

              <option value="">Choose Language</option>

              {languages.map(lang => (
                <option key={lang._id} value={lang._id}>
                  {lang.english}
                </option>
              ))}
              <option value="all">All Language</option>

            </select>

          </div>

          {isAllLanguage && (

            <div className="addwords-page__grammar-box">

              <div className="addwords-page__grammar-header">
                New Chapter Name
              </div>

              {uiLanguages.map(lang => (

                <input
                  key={lang}
                  placeholder={`Chapter name ${lang}`}
                  value={newChapter[lang] || ""}
                  onChange={(e) =>
                    setNewChapter({
                      ...newChapter,
                      [lang]: e.target.value
                    })
                  }
                />

              ))}

            </div>

          )}

          {/* Chapter */}
          <div className="addwords-page__field">
            <label>Select Chapter</label>

            <select
              value={chapterId}
              onChange={(e) => setChapterId(e.target.value)}
            >

              <option value="">Choose Chapter</option>

              {chapters.map(c => (
                <option key={c._id} value={c._id}>
                  {c.translations?.en}
                </option>
              ))}

            </select>

          </div>

          {/* Content Type */}
          <div className="addwords-page__field">
            <label>Select Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              <option value="text">Text Block</option>
              <option value="textarea">Textarea (Grammar Detail)</option>
            </select>
          </div>

          {/* Grammar Section (Only when Textarea selected) */}
          {contentType === "textarea" && (
            <div className="addwords-page__grammar-box">

              <div className="addwords-page__grammar-header">
                Grammar Details
              </div>

              {uiLanguages.map(lang => (
                <div key={lang} className="addwords-page__grammar-field">
                  <label className="addwords-page__grammar-label">
                    {lang.toUpperCase()} Explanation
                  </label>

                  <RichEditor
                    value={grammarContent[lang]}
                    onChange={(value) =>
                      handleGrammarChange(lang, value)
                    }
                  />
                </div>
              ))}

            </div>
          )}
          {contentType === "text" && (
            <>
              {/* Difficulties */}
              {learnWords.map((diff, dIndex) => (
                <div key={dIndex} className="addwords-page__difficulty-box">

                  <div className="addwords-page__difficulty-header">

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
                      type="button"
                      className="addwords-page__add-btn"
                      onClick={() => addWord(dIndex)}
                    >
                      <PlusIcon />
                      <span>Add Word</span>
                    </button>


                    {
                      learnWords.length > 1 && (

                        <button
                          type="button"
                          className="addwords-page__icon-btn danger"
                          onClick={() => removeDifficulty(dIndex)}
                        >
                          <TrashIcon />
                        </button>
                      )}


                  </div>

                  {diff.words.map((word, wIndex) => (
                    <div key={wIndex} className="addwords-page__word-row">

                      {uiLanguages.map(lang => (
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
                          type="button"
                          className="addwords-page__icon-btn danger"
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
                type="button"
                className="addwords-page__add-btn"
                onClick={addDifficulty}
              >

                <PlusIcon /> Add Difficulty
              </button>
            </>
          )}
          <button
            type="button"
            className="addwords-page__save-btn"
            disabled={loading}
            onClick={validateForm}
          >
            {loading ? "Updating..." : "Update Words"}
          </button>

        </div>
      </div>

    </>
  );
}
