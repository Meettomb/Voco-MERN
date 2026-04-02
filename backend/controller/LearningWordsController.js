import LearningWord from "../model/LearningWordsModel.js";
import LearningLanguagesModel from "../model/LearningLanguagesModel.js";
import ChapterModel from "../model/ChapterModel.js";
import fs from "fs";
import path from "path";

export const addLearningWord = async (req, res) => {
    try {
        let {
            chapterId,
            contentType,
            learningWordsLangauge,
            isAllLanguage
        } = req.body;

        console.log("BODY:", req.body);
        let translations = req.body.translations ? JSON.parse(req.body.translations) : null;
        let grammarContent = {};

        try {
            if (req.body.grammarContent) {
                grammarContent = JSON.parse(req.body.grammarContent);
            }
        } catch (err) {
            console.log("JSON parse error:", err);
        }
        let difficulties = req.body.difficulties ? JSON.parse(req.body.difficulties) : null;

        /* =========================
           COMMON MERGE FUNCTION
        ========================= */

        const mergeData = (existing) => {

            if (contentType === "TextBlock") {

                difficulties.forEach(newDiff => {

                    const existingDiff = existing.difficulties.find(
                        d => d.level === newDiff.level
                    );

                    if (existingDiff) {

                        newDiff.words.forEach(newWord => {

                            if (!newWord?.en) return; // skip invalid data

                            const newEn = newWord.en.toLowerCase();

                            const exists = existingDiff.words.some(w =>
                                w?.en && w.en.toLowerCase() === newEn
                            );

                            if (!exists) {
                                existingDiff.words.push(newWord);
                            }

                        });

                    } else {
                        existing.difficulties.push(newDiff);
                    }

                });

                existing.grammarContent = {};
            }

            if (contentType === "TextArea") {

                if (!existing.grammarContent) {
                    existing.grammarContent = {};
                }

                existing.grammarContent = grammarContent;

                existing.markModified("grammarContent");  //

                existing.difficulties = [];
            }

            return existing;
        };

        /* =========================
           ALL LANGUAGE MODE
        ========================= */

        if (isAllLanguage === "true") {

            const languages = await LearningLanguagesModel.find();
            let savedData = [];

            for (let lang of languages) {

                const chapter = await ChapterModel.findOneAndUpdate(
                    { languageId: lang._id, translations },
                    { languageId: lang._id, translations },
                    { new: true, upsert: true }
                );

                if (!lang.chapters.includes(chapter._id)) {
                    lang.chapters.push(chapter._id);
                    await lang.save();
                }

                const existing = await LearningWord.findOne({
                    chapterId: chapter._id,
                    learningWordsLangauge: lang._id
                });

                if (existing) {

                    const updated = mergeData(existing);
                    await updated.save();
                    savedData.push(updated);

                } else {

                    const newDoc = await LearningWord.create({
                        chapterId: chapter._id,
                        learningWordsLangauge: lang._id,
                        contentType,
                        grammarContent: contentType === "TextArea" ? grammarContent : {},
                        difficulties: contentType === "TextBlock" ? difficulties : []
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

        /* =========================
           NORMAL MODE
        ========================= */

        const existing = await LearningWord.findOne({
            chapterId,
            learningWordsLangauge
        });

        if (existing) {

            const updated = mergeData(existing);
            await updated.save();

            return res.json({
                status: 1,
                message: "Updated existing chapter",
                data: updated
            });

        } else {

            const newDoc = await LearningWord.create({
                chapterId,
                learningWordsLangauge,
                contentType,
                grammarContent: contentType === "TextArea" ? grammarContent : {},
                difficulties: contentType === "TextBlock" ? difficulties : []
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


export const getLearningWords = async (req, res) => {
    try {
        const learningWords = await LearningWord.find()
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

export const deleteLearningWordById = async (req, res) => {
    try {

        const { id } = req.params;

        const learningWord = await LearningWord.findById(id);

        if (!learningWord) {
            return res.status(404).json({
                message: "Learning word not found"
            });
        }

        /* -------- DELETE IMAGES (multi-language) -------- */

        if (learningWord.grammarContent) {

            Object.keys(learningWord.grammarContent).forEach(lang => {

                const text = learningWord.grammarContent[lang];

                if (!text) return;

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

        /* -------- DELETE DB -------- */

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


export const updateLearningWordById = async (req, res) => {

    try {

        const { id } = req.params;

        let {
            chapterId,
            contentType,
            learningWordsLangauge,
            isAllLanguage
        } = req.body;


        /* ========= PARSE ========= */

        let translations = req.body.translations;
        if (translations) translations = JSON.parse(translations);

        let grammarContent = req.body.grammarContent;
        if (grammarContent) grammarContent = JSON.parse(grammarContent);

        let difficulties = req.body.difficulties;

        if (difficulties) {

            difficulties = JSON.parse(difficulties);

            if (!Array.isArray(difficulties)) {
                difficulties = [difficulties];
            }

            difficulties = difficulties.map(d => ({
                level: d.level,
                words: (d.words || []).map(w => ({ ...w }))
            }));

        }


        const doc = await LearningWord.findById(id);

        if (!doc) {

            return res.json({
                status: 0,
                message: "Word not found"
            });

        }


        /* ========= NORMAL ========= */

        doc.chapterId = chapterId;
        doc.learningWordsLangauge = learningWordsLangauge;
        doc.contentType = contentType;


        if (contentType === "TextArea") {

            doc.grammarContent = grammarContent || {};
            doc.difficulties = [];

        }


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

    }
    catch (err) {

        console.log(err);

        return res.json({
            status: 0,
            message: err.message
        });

    }

};


export const deleteLearningWordsByChapterId = async (req, res) => {
    try {

        const { chapterId } = req.params;

        const words = await LearningWord.find({
            chapterId: chapterId
        });

        if (!words.length) {
            return res.status(404).json({
                message: "No words found for this chapter"
            });
        }


        /* -------- delete images -------- */

        for (let learningWord of words) {

            if (learningWord.grammarContent) {

                Object.keys(learningWord.grammarContent).forEach(lang => {

                    const text = learningWord.grammarContent[lang];

                    if (!text) return;

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


        /* -------- delete DB -------- */

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