import React, { useState } from "react";
import usePageTitle from '../../../hooks/usePageTitle';
import RichEditor from "../../RichEditor";

const UI_LANGUAGES = ["en", "hi"];

export default function AddWords() {
    const [contentType, setContentType] = useState("text");
    // "text" | "textarea"

    const [grammarContent, setGrammarContent] = useState({
        en: "",
        hi: ""
    });

    usePageTitle("Add Learning Words");
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



    const chapters = [
        { id: "1", name: "Chapter 1" },
        { id: "2", name: "Chapter 2" }
    ];

    const [chapterId, setChapterId] = useState("");
    const [learnWords, setLearnWords] = useState([
        { difficulty: "", words: [{ translations: { en: "", hi: "" } }] }
    ]);

    const [error, setError] = useState("");

    /* ---------------- ADD ---------------- */

    const addDifficulty = () => {
        setLearnWords([  // Update learnWords state
            ...learnWords, // Keep all existing difficulty groups
            { difficulty: "", words: [{ translations: { en: "", hi: "" } }] } // Add a new empty difficulty with one word
        ]);
    };

    const addWord = (dIndex) => {
        const copy = [...learnWords];  // Create a copy of learnWords array
        copy[dIndex].words.push({ translations: { en: "", hi: "" } }); // Add a new empty word to the specified difficulty group
        setLearnWords(copy); // Save updated array to state
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

    const validateForm = () => {

        if (!chapterId) {
            setError("Please select a chapter.");
            return;
        }

        // If textarea selected → validate grammar only
        if (contentType === "textarea") {
            for (let lang of UI_LANGUAGES) {
                if (!grammarContent[lang].trim()) {
                    setError("Please fill all grammar language fields.");
                    return;
                }
            }
        }

        // If text block selected → validate word groups
        if (contentType === "text") {
            for (let d of learnWords) {
                if (!d.difficulty) {
                    setError("Please select difficulty for all groups.");
                    return;
                }

                for (let w of d.words) {
                    for (let lang of UI_LANGUAGES) {
                        if (!w.translations[lang]) {
                            setError("Please fill all language word fields.");
                            return;
                        }
                    }
                }
            }
        }

        setError("");

        console.log({
            chapterId,
            contentType,
            grammarContent,
            learnWords
        });
    };

    return (
        <div className="addwords-page">
            <div className="addwords-page__card">

                <h2 className="addwords-page__title">Add Learning Words</h2>

                {error && <div className="addwords-page__error">{error}</div>}

                {/* Chapter */}
                <div className="addwords-page__field">
                    <label>Select Chapter</label>
                    <select value={chapterId} onChange={(e) => setChapterId(e.target.value)}>
                        <option value="">Choose Chapter</option>
                        {chapters.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
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

                        {UI_LANGUAGES.map(lang => (
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
                    onClick={validateForm}
                >
                    Save Words
                </button>

            </div>
        </div>
    );
}
