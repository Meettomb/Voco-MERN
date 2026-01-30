import React, { useState } from "react";

const UI_LANGUAGES = ["en", "fr"];

export default function AddWords() {
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
        { difficulty: "", words: [{ translations: { en: "", fr: "" } }] }
    ]);

    const [error, setError] = useState("");

    /* ---------------- ADD ---------------- */

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

    /* ---------------- REMOVE ---------------- */

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

    /* ---------------- CHANGE ---------------- */

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

    /* ---------------- VALIDATE ---------------- */

    const validateForm = () => {

        if (!chapterId) {
            setError("Please select a chapter.");
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
                        setError("Please fill all language word fields.");
                        return;
                    }
                }
            }
        }

        setError("");
        console.log({ chapterId, learnWords });
    };

    return (
        <div className="addwords-page">
            <div className="addwords-page__card">

                <h2 className="addwords-page__title">Add Learn Words</h2>

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


                            <button
                                type="button"
                                className="addwords-page__icon-btn danger"
                                onClick={() => removeDifficulty(dIndex)}
                            >
                                <TrashIcon />
                            </button>


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

                                <button
                                    type="button"
                                    className="addwords-page__icon-btn danger"
                                    onClick={() => removeWord(dIndex, wIndex)}
                                >
                                    <CloseIcon />
                                </button>


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
