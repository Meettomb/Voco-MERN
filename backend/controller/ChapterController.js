import ChapterModel from "../model/ChapterModel.js";
export const getUniqueChapters = async (req, res) => {
    try {

        const chapters = await ChapterModel.find().lean();

        const map = {};
        // console.log(chapters);
        for (let ch of chapters) {

            const name = ch?.translations?.en;

            if (!name) continue;

            if (!map[name]) {

                map[name] = {
                    name: name,
                    ids: []
                };

            }

            map[name].ids.push(ch._id.toString());

        }

        const result = Object.values(map);

        res.json({
            status: 1,
            message: "Unique chapters",
            data: result
        });

    } catch (err) {

        res.json({
            status: 0,
            message: err.message
        });

    }
};