import LearningWord from "../model/LearningWordsModel.js";
import fs from "fs";
import path from "path";

export const addLearningWord = async (req, res) => {
    try {

        const {
            chapterId,
            contentType,
            grammarContent,
            difficulties
        } = req.body;

        let data = {
            chapterId,
            contentType,
        };

        /* -------- TEXTAREA -------- */

        if (contentType === "TextArea") {

            let finalGrammar = grammarContent || "";

            // replace images
            if (req.files && req.files.length > 0) {

                req.files.forEach(file => {

                    const fullURL =
                        `${req.protocol}://${req.get("host")}/uploads/images/${file.filename}`;

                    const regex = new RegExp(
                        `src="${file.originalname}"`,
                        "g"
                    );

                    finalGrammar = finalGrammar.replace(
                        regex,
                        `src="${fullURL}"`
                    );

                });
            }

            // ✅ clean escaped characters safely
            if (typeof finalGrammar === "string") {
                finalGrammar = finalGrammar
                    .replace(/\\n/g, "")
                    .replace(/\\"/g, '"');
            }

            data.grammarContent = finalGrammar;
            data.difficulties = [];
        }

        /* -------- TEXTBLOCK -------- */

        if (contentType === "TextBlock") {

            data.grammarContent = "";
            data.difficulties = difficulties;
        }

        const learningWord = new LearningWord(data);

        await learningWord.save();

        res.status(201).json({
            message: "Learning word added",
            data: learningWord
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};

export const getLearningWords = async (req, res) => {
    try {
        const learningWords = await LearningWord.find();

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

        /* -------- DELETE IMAGES -------- */

        if (learningWord.grammarContent) {

            const regex = /src="([^"]+)"/g;

            let match;

            while ((match = regex.exec(learningWord.grammarContent)) !== null) {

                const imageURL = match[1];

                // convert URL to file path
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

        const oldData = await LearningWord.findById(id);

        if (!oldData) {
            return res.status(404).json({
                message: "Learning word not found"
            });
        }

        /* ---------- get body safely (important for multer) ---------- */

        const chapterId = req.body.chapterId || oldData.chapterId;
        const contentType = req.body.contentType || oldData.contentType;
        const grammarContent =
            req.body.grammarContent ?? oldData.grammarContent;
        const difficulties =
            req.body.difficulties ?? oldData.difficulties;

        let finalGrammar = grammarContent || "";

        /* ---------- replace new images ---------- */

        if (req.files && req.files.length > 0) {

            req.files.forEach(file => {

                const fullURL =
                    `${req.protocol}://${req.get("host")}/uploads/images/${file.filename}`;

                const regex = new RegExp(
                    `src="${file.originalname}"`,
                    "g"
                );

                finalGrammar = finalGrammar.replace(
                    regex,
                    `src="${fullURL}"`
                );

            });
        }

        /* ---------- clean escaped chars ---------- */

        if (typeof finalGrammar === "string") {
            finalGrammar = finalGrammar
                .replace(/\\n/g, "")
                .replace(/\\"/g, '"');
        }

        /* ---------- delete removed images ---------- */

        if (oldData.grammarContent) {

            const oldImgs =
                oldData.grammarContent.match(/src="([^"]+)"/g) || [];

            const newImgs =
                finalGrammar.match(/src="([^"]+)"/g) || [];

            const oldList = oldImgs.map(x =>
                x.replace(/src="|"/g, "")
            );

            const newList = newImgs.map(x =>
                x.replace(/src="|"/g, "")
            );

            oldList.forEach(img => {

                if (!newList.includes(img)) {

                    const filePath = img.replace(
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

        /* ---------- prepare update data ---------- */

        let data = {
            chapterId,
            contentType
        };

        if (contentType === "TextArea") {

            data.grammarContent = finalGrammar;
            data.difficulties = [];

        }

        if (contentType === "TextBlock") {

            data.grammarContent = "";
            data.difficulties = difficulties;

        }

        /* ---------- update ---------- */

        const updated = await LearningWord.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        res.status(200).json({
            message: "Learning word updated",
            data: updated
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};
