
export const getRandomOpeningQuestion = (uiLang, learningLang) => {
    const questions = {
        en: [
            "Hi there! 😊 What do you usually enjoy doing in your free time?",
            "Hello! If you could travel anywhere in the world, where would you go?",
            "Hey! What was the most interesting thing that happened to you recently?",
            "Hi! Are you a morning person or a night owl? Why?",
            "Hello! What's your favorite food, and how often do you eat it?",
            "Hey there! What kind of movies or TV shows do you enjoy watching?",
            "Hi! If you could learn any new skill, what would you choose?",
            "Hello! What does your perfect weekend look like?",
            "Hey! Do you prefer travelling alone or with friends? Why?",
            "Hi there! What's something new you'd like to try this year?",
            "Hello! What kind of music do you enjoy listening to?",
            "Hey! If you could meet any famous person, who would it be?",
            "Hi! What's your favorite childhood memory?",
            "Hello! Do you prefer living in a busy city or a peaceful village?",
            "Hey there! What is one thing that always makes you happy?"
        ],

        hi: [
            "नमस्ते! आपको अपने खाली समय में क्या करना पसंद है?",
            "नमस्ते! अगर आप दुनिया में कहीं भी घूमने जा सकते, तो कहाँ जाते?",
            "हैलो! हाल ही में आपके साथ सबसे दिलचस्प क्या हुआ?",
            "नमस्ते! आपको सुबह जल्दी उठना पसंद है या देर रात तक जागना?",
            "हैलो! आपका पसंदीदा खाना कौन-सा है और क्यों?",
            "नमस्ते! आपको किस तरह की फिल्में देखना पसंद है?",
            "हैलो! अगर आप कोई नया कौशल सीख सकते, तो क्या सीखते?",
            "नमस्ते! आपके लिए एक शानदार सप्ताहांत कैसा होगा?",
            "हैलो! आपको अकेले घूमना पसंद है या दोस्तों के साथ?",
            "नमस्ते! इस साल आप कौन-सी नई चीज़ आज़माना चाहेंगे?",
            "हैलो! आपको किस तरह का संगीत सुनना पसंद है?",
            "नमस्ते! अगर आप किसी प्रसिद्ध व्यक्ति से मिल सकते, तो किससे मिलते?",
            "हैलो! आपके बचपन की सबसे अच्छी याद क्या है?",
            "नमस्ते! आपको बड़े शहर में रहना पसंद है या शांत गाँव में?",
            "हैलो! ऐसी कौन-सी चीज़ है जो आपको हमेशा खुश कर देती है?"
        ]
    };

    const languageQuestions =
        questions[learningLang] || questions.en;

    const randomIndex = Math.floor(
        Math.random() * languageQuestions.length
    );

    const question = languageQuestions[randomIndex];

    if (uiLang === "hi" && learningLang === "en") {
        return `नमस्ते! चलिए, अंग्रेज़ी में बातचीत का अभ्यास करते हैं। ${question}`;
    }

    if (uiLang === "en" && learningLang === "hi") {
        return `Hello! Let's practise speaking Hindi together. ${question}`;
    }

    return question;
};
