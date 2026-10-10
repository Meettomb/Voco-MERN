import LearningWord from "../model/LearningWordsModel.js";
import LearningLanguagesModel from "../model/LearningLanguagesModel.js";
import ChapterModel from "../model/ChapterModel.js";
import fs from "fs";
import path from "path";

/*
 * Design Pattern: Strategy Pattern
 * Type: Behavioral
 *
 * Why:
 * TextBlock and TextArea use different processing algorithms.
 * Strategy Pattern separates these algorithms while keeping
 * the controller clean.
 *
 * Performance:
 * Strategies process data in memory and do not add MongoDB
 * queries, so data retrieval performance remains unchanged.
 */

const textBlockStrategy = (existing, difficulties) => {

    if (!Array.isArray(difficulties)) {
        return existing;
    }

    if (!Array.isArray(existing.difficulties)) {
        existing.difficulties = [];
    }

    difficulties.forEach(newDiff => {

        const existingDiff = existing.difficulties.find(
            d => d.level === newDiff.level
        );

        if (existingDiff) {

            if (!Array.isArray(existingDiff.words)) {
                existingDiff.words = [];
            }

            if (!Array.isArray(newDiff.words)) {
                return;
            }

            newDiff.words.forEach(newWord => {

                // Ignore invalid words that do not contain English text.
                if (!newWord?.en) {
                    return;
                }

                const newEn = newWord.en.toLowerCase();

                // Check the existing difficulty level for duplicates.
                const exists = existingDiff.words.some(
                    w => w?.en && w.en.toLowerCase() === newEn
                );

                // Add the word only when it does not already exist.
                if (!exists) {
                    existingDiff.words.push(newWord);
                }
            });

        } else {

            // Add a completely new difficulty level.
            existing.difficulties.push(newDiff);
        }
    });

    /*
     * TextBlock content does not use grammarContent.
     * Therefore, clear any previous grammar content.
     */
    existing.grammarContent = {};

    return existing;
};


/*
 * TextBlock Strategy:
 * Handles difficulty levels and prevents duplicate words
 * when merging TextBlock content.
 */

const textAreaStrategy = (existing, grammarContent) => {

    if (!existing.grammarContent) {
        existing.grammarContent = {};
    }

    existing.grammarContent = grammarContent || {};

    /*
     * grammarContent can contain nested or dynamically generated
     * language-specific content, so explicitly tell Mongoose
     * that this field has been modified.
     */
    existing.markModified("grammarContent");

    /*
     * TextArea content does not use difficulty-based words.
     */
    existing.difficulties = [];

    return existing;
};


/*
 * ============================================================
 * STRATEGY SELECTOR
 * ============================================================
 *
 * This function selects the correct processing strategy based
 * on contentType.
 *
 * The database is NOT accessed here.
 * This function only selects an in-memory processing strategy.
 */
const getContentStrategy = (contentType) => {

    switch (contentType) {

        case "TextBlock":
            return {
                process: (existing, data) =>
                    textBlockStrategy(existing, data)
            };

        case "TextArea":
            return {
                process: (existing, data) =>
                    textAreaStrategy(existing, data)
            };

        default:
            return null;
    }
};


/*
 * ============================================================
 * ADD LEARNING WORD
 * ============================================================
 */
export const addLearningWord = async (req, res) => {

    try {

        let {
            chapterId,
            contentType,
            learningWordsLangauge,
            isAllLanguage
        } = req.body;


        /*
         * Parse request data.
         */
        let translations = req.body.translations
            ? JSON.parse(req.body.translations)
            : null;

        let grammarContent = {};

        try {

            if (req.body.grammarContent) {
                grammarContent = JSON.parse(req.body.grammarContent);
            }

        } catch (err) {

            console.log("JSON parse error:", err);
        }


        let difficulties = req.body.difficulties
            ? JSON.parse(req.body.difficulties)
            : null;


        /*
         * ====================================================
         * STRATEGY SELECTION
         * ====================================================
         *
         * Select the processing algorithm once.
         *
         * This does not perform any database operation.
         */
        const contentStrategy = getContentStrategy(contentType);


        /*
         * ====================================================
         * ALL LANGUAGE MODE
         * ====================================================
         */
        if (isAllLanguage === "true") {

            const languages = await LearningLanguagesModel.find();

            let savedData = [];


            for (let lang of languages) {

                /*
                 * Existing database operation is preserved.
                 * No additional retrieval query is introduced
                 * by the Strategy Pattern.
                 */
                const chapter = await ChapterModel.findOneAndUpdate(
                    {
                        languageId: lang._id,
                        translations
                    },
                    {
                        languageId: lang._id,
                        translations
                    },
                    {
                        new: true,
                        upsert: true
                    }
                );


                if (!lang.chapters.includes(chapter._id)) {

                    lang.chapters.push(chapter._id);

                    await lang.save();
                }


                /*
                 * Existing LearningWord retrieval is preserved.
                 */
                const existing = await LearningWord.findOne({
                    chapterId: chapter._id,
                    learningWordsLangauge: lang._id
                });


                if (existing) {

                    /*
                     * Apply the selected strategy to the
                     * already retrieved document.
                     *
                     * No additional database retrieval occurs.
                     */
                    if (contentStrategy) {

                        const strategyData =
                            contentType === "TextBlock"
                                ? difficulties
                                : grammarContent;

                        contentStrategy.process(
                            existing,
                            strategyData
                        );
                    }

                    await existing.save();

                    savedData.push(existing);

                } else {

                    /*
                     * Create a new document when no existing
                     * LearningWord document was found.
                     */
                    const newDoc = await LearningWord.create({

                        chapterId: chapter._id,

                        learningWordsLangauge: lang._id,

                        contentType,

                        grammarContent:
                            contentType === "TextArea"
                                ? grammarContent
                                : {},

                        difficulties:
                            contentType === "TextBlock"
                                ? difficulties
                                : []
                    });


                    savedData.push(newDoc);
                }
            }


            return res.json({
                status: 1,
                message: "Saved for all languages",
                data: savedData
            });
        }


        /*
         * ====================================================
         * NORMAL MODE
         * ====================================================
         *
         * The existing single-document retrieval is preserved.
         */
        const existing = await LearningWord.findOne({
            chapterId,
            learningWordsLangauge
        });


        if (existing) {

            /*
             * Apply the selected Strategy to the document
             * that has already been retrieved from MongoDB.
             */
            if (contentStrategy) {

                const strategyData =
                    contentType === "TextBlock"
                        ? difficulties
                        : grammarContent;

                contentStrategy.process(
                    existing,
                    strategyData
                );
            }


            /*
             * Save only after the selected strategy has completed
             * its in-memory processing.
             */
            await existing.save();


            return res.json({
                status: 1,
                message: "Updated existing chapter",
                data: existing
            });

        } else {

            /*
             * Create a new LearningWord document.
             *
             * Strategy Pattern is primarily required when an
             * existing document needs different processing.
             * Creation logic remains unchanged because both
             * content types already have simple object creation
             * rules.
             */
            const newDoc = await LearningWord.create({

                chapterId,

                learningWordsLangauge,

                contentType,

                grammarContent:
                    contentType === "TextArea"
                        ? grammarContent
                        : {},

                difficulties:
                    contentType === "TextBlock"
                        ? difficulties
                        : []
            });


            return res.json({
                status: 1,
                message: "Created new chapter",
                data: newDoc
            });
        }


    } catch (err) {

        console.log(err);

        return res.json({
            status: 0,
            message: err.message
        });
    }
};


/*
 * ============================================================
 * GET ALL LEARNING WORDS
 * ============================================================
 *
 * No Strategy Pattern is needed here because this operation
 * does not contain multiple algorithms.
 *
 * The existing MongoDB retrieval logic is intentionally kept
 * unchanged for performance.
 */
export const getLearningWords = async (req, res) => {

    try {

        const { languageId } = req.query;

        const query = languageId
            ? { learningWordsLangauge: languageId }
            : {};

        const learningWords = await LearningWord.find(query)
            .populate("learningWordsLangauge")
            .populate("chapterId");

        res.status(200).json({
            message: "Learning words fetched",
            data: learningWords
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


/*
 * ============================================================
 * DELETE LEARNING WORD BY ID
 * ============================================================
 */
export const deleteLearningWordById = async (req, res) => {

    try {

        const { id } = req.params;


        /*
         * Retrieve the document once.
         */
        const learningWord = await LearningWord.findById(id);


        if (!learningWord) {

            return res.status(404).json({
                message: "Learning word not found"
            });
        }


        /*
         * ====================================================
         * DELETE IMAGES
         * ====================================================
         *
         * Grammar content can contain image URLs for multiple
         * languages. Remove those files before deleting the
         * database document.
         */
        if (learningWord.grammarContent) {

            Object.keys(learningWord.grammarContent).forEach(lang => {

                const text =
                    learningWord.grammarContent[lang];


                if (!text) {
                    return;
                }


                const regex = /src="([^"]+)"/g;

                let match;


                while ((match = regex.exec(text)) !== null) {

                    const imageURL = match[1];


                    const filePath = imageURL.replace(
                        `${req.protocol}://${req.get("host")}/`,
                        ""
                    );


                    const fullPath = path.join(
                        process.cwd(),
                        filePath
                    );


                    if (fs.existsSync(fullPath)) {

                        fs.unlinkSync(fullPath);
                    }
                }
            });
        }


        /*
         * ====================================================
         * DELETE DATABASE DOCUMENT
         * ====================================================
         */
        await LearningWord.findByIdAndDelete(id);


        res.status(200).json({
            message: "Learning word and images deleted"
        });


    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


/*
 * ============================================================
 * UPDATE LEARNING WORD BY ID
 * ============================================================
 */
export const updateLearningWordById = async (req, res) => {

    try {

        const { id } = req.params;


        let {
            chapterId,
            contentType,
            learningWordsLangauge,
            isAllLanguage
        } = req.body;


        /*
         * ====================================================
         * PARSE REQUEST DATA
         * ====================================================
         */
        let translations = req.body.translations;

        if (translations) {
            translations = JSON.parse(translations);
        }


        let grammarContent = req.body.grammarContent;

        if (grammarContent) {
            grammarContent = JSON.parse(grammarContent);
        }


        let difficulties = req.body.difficulties;


        if (difficulties) {

            difficulties = JSON.parse(difficulties);


            if (!Array.isArray(difficulties)) {

                difficulties = [difficulties];
            }


            difficulties = difficulties.map(d => ({

                level: d.level,

                words: (d.words || []).map(
                    w => ({ ...w })
                )
            }));
        }


        /*
         * ====================================================
         * STRATEGY SELECTION
         * ====================================================
         *
         * Select the same content processing strategy used by
         * the add operation.
         */
        const contentStrategy = getContentStrategy(contentType);


        /*
         * Existing single-document retrieval is preserved.
         * No additional database query is introduced.
         */
        const doc = await LearningWord.findById(id);


        if (!doc) {

            return res.json({
                status: 0,
                message: "Word not found"
            });
        }


        /*
         * Update common document properties.
         */
        doc.chapterId = chapterId;

        doc.learningWordsLangauge =
            learningWordsLangauge;

        doc.contentType = contentType;


        /*
         * ====================================================
         * APPLY STRATEGY
         * ====================================================
         *
         * The strategy is responsible only for content-specific
         * processing.
         *
         * Database retrieval and saving remain outside the
         * strategy, keeping the pattern lightweight.
         */

        if (contentType === "TextBlock") {
            doc.grammarContent = {};

            doc.difficulties = difficulties || [];
        }



        await doc.save();


        return res.json({
            status: 1,
            message: "Updated successfully",
            data: doc
        });


    } catch (err) {

        console.log(err);

        return res.json({
            status: 0,
            message: err.message
        });
    }
};


/*
 * ============================================================
 * DELETE LEARNING WORDS BY CHAPTER ID
 * ============================================================
 */
export const deleteLearningWordsByChapterId = async (req, res) => {

    try {

        const { chapterId } = req.params;


        /*
         * Retrieve all words for the chapter.
         *
         * This is the existing database retrieval and is not
         * modified by the Strategy Pattern.
         */
        const words = await LearningWord.find({
            chapterId: chapterId
        });


        if (!words.length) {

            return res.status(404).json({
                message: "No words found for this chapter"
            });
        }


        /*
         * ====================================================
         * DELETE IMAGES
         * ====================================================
         */
        for (let learningWord of words) {

            if (learningWord.grammarContent) {

                Object.keys(
                    learningWord.grammarContent
                ).forEach(lang => {

                    const text =
                        learningWord.grammarContent[lang];


                    if (!text) {
                        return;
                    }


                    const regex = /src="([^"]+)"/g;

                    let match;


                    while ((match = regex.exec(text)) !== null) {

                        const imageURL = match[1];


                        const filePath = imageURL.replace(
                            `${req.protocol}://${req.get("host")}/`,
                            ""
                        );


                        const fullPath = path.join(
                            process.cwd(),
                            filePath
                        );


                        if (fs.existsSync(fullPath)) {

                            fs.unlinkSync(fullPath);
                        }
                    }
                });
            }
        }


        /*
         * ====================================================
         * DELETE DATABASE DOCUMENTS
         * ====================================================
         */
        await LearningWord.deleteMany({
            chapterId: chapterId
        });


        res.status(200).json({
            message: "All words deleted for this chapter"
        });


    } catch (error) {

        res.status(400).json({
            message: error.message
        });
    }
};


/*
 * ============================================================
 * GET LEARNING WORD BY ID
 * ============================================================
 *
 * The existing retrieval uses a single findById operation
 * followed by populate calls. This is intentionally preserved
 * so the Strategy Pattern does not affect retrieval performance.
 */

export const getLearningWordById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                status: 0,
                message: "Chapter ID is required"
            });
        }

        const chapter = await LearningWord.findById(id)
            .lean()
            .maxTimeMS(5000);

        if (!chapter) {
            return res.status(404).json({
                status: 0,
                message: "Chapter content not found"
            });
        }

        return res.status(200).json({
            status: 1,
            message: "Chapter content fetched successfully",
            data: chapter
        });

    } catch (error) {
        console.error("Error fetching chapter content:", {
            id: req.params.id,
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        if (error.name === "CastError") {
            return res.status(400).json({
                status: 0,
                message: "Invalid learning-word document ID"
            });
        }

        return res.status(500).json({
            status: 0,
            message: "Failed to fetch chapter content"
        });
    }
};

export const getChaptersByLanguage = async (req, res) => {
    try {
        const { languageId } = req.params;

        if (!languageId) {
            return res.status(400).json({
                status: 0,
                message: "Language ID is required"
            });
        }

        const chapters = await LearningWord.find({
            learningWordsLangauge: languageId
        })
            .select("_id chapterId")
            .populate({
                path: "chapterId",
                select: "translations"
            })
            .sort({ _id: 1 })
            .lean()
            .maxTimeMS(5000);

        return res.status(200).json({
            status: 1,
            message: "Chapters fetched successfully",
            data: chapters
        });

    } catch (error) {
        console.error("Error fetching chapters:", error);

        return res.status(500).json({
            status: 0,
            message: "Failed to fetch chapters"
        });
    }
};