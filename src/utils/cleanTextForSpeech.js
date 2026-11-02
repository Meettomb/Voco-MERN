const cleanTextForSpeech = (text) => {
    if (typeof text !== "string") return "";

    return text
        .replace(/\p{Extended_Pictographic}/gu, "")
        .replace(/\uFE0F/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

export default cleanTextForSpeech;