// import { useEffect } from "react";
import heroImage from '../assets/images/hero-visual.png'
import usePageTitle from '../hooks/usePageTitle';
import { useTranslation } from 'react-i18next';

function Home({ onOpen }) {

    usePageTitle("Learn Languages");
    const { t, i18n } = useTranslation();

    const speakText = () => {
        if (!window.speechSynthesis) {
            alert("Speech not supported in this browser");
            return;
        }

        const text =
            i18n.language === "hi"
                ? t("home.learningPreview.example")   // Hindi sentence
                : `${t("home.learningPreview.example")}`;

        const utterance = new SpeechSynthesisUtterance(text);

        // Set correct language
        utterance.lang =
            i18n.language === "hi"
                ? "hi-IN"
                : "en-US";

        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    };




    return (
        <div>
            <main className="homePage_main">
                <div className="homePage_main_outer">
                    <section className="homePage_section1">
                        <div className="hero-container">

                            {/* LEFT CONTENT */}
                            <div className="hero-left">
                                <h1>
                                    {t('home.hero-section.titleLine1')} <br />
                                    <span>{t('home.hero-section.titleLine2')}</span>
                                </h1>

                                <p>
                                    {t('home.hero-section.description')}
                                </p>

                                <div className="hero-buttons">
                                    <button className="primary-btn" onClick={onOpen}>{t('home.hero-section.cta.primary')}</button>
                                    <button className="secondary-btn">{t('home.hero-section.cta.secondary')}</button>
                                </div>

                                <div className="hero-flow">
                                    <span>{t('home.hero-section.flow.words')}</span>

                                    <svg className="flow-arrow" viewBox="0 -960 960 960">
                                        <path d="m600-200-57-56 184-184H80v-80h647L544-704l56-56 280 280-280 280Z" />
                                    </svg>

                                    <span>{t('home.hero-section.flow.videos')}</span>

                                    <svg className="flow-arrow" viewBox="0 -960 960 960">
                                        <path d="m600-200-57-56 184-184H80v-80h647L544-704l56-56 280 280-280 280Z" />
                                    </svg>

                                    <span>{t('home.hero-section.flow.mcqs')}</span>

                                    <svg className="flow-arrow" viewBox="0 -960 960 960">
                                        <path d="m600-200-57-56 184-184H80v-80h647L544-704l56-56 280 280-280 280Z" />
                                    </svg>

                                    <span>{t('home.hero-section.flow.confidence')}</span>
                                </div>

                            </div>

                            {/* RIGHT IMAGE */}
                            <div className="hero-right">
                                <img
                                    src={heroImage}
                                    alt="VOCO learning preview"
                                    className="hero-image"
                                />
                            </div>

                        </div>
                    </section>

                    <section className="homePage_section2">
                        <div className="how-voco-container">

                            {/* Section Heading */}
                            <div className="how-voco-word">
                                <h2>{t('home.howItWorks.title')}</h2>
                                <p>
                                    {t('home.howItWorks.subtitle')}
                                </p>
                            </div>

                            {/* Steps */}
                            <div className="how-voco-steps">

                                {/* STEP 1: Learn Words */}
                                <div className="how-card">
                                    <div className="how-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                            <path d="M300-80q-58 0-99-41t-41-99v-520q0-58 41-99t99-41h500v600q-25 0-42.5 17.5T740-220q0 25 17.5 42.5T800-160v80H300Zm20-280h80v-440h-80v440Zm-20 200h373q-6-14-9.5-28.5T660-220q0-16 3-31t10-29H300q-26 0-43 17.5T240-220q0 26 17 43t43 17Z" />
                                        </svg>
                                    </div>
                                    <h3>{t('home.howItWorks.step1.title')}</h3>
                                    <p>
                                        {t('home.howItWorks.step1.description')}
                                    </p>
                                </div>

                                {/* STEP 2: Watch Videos */}
                                <div className="how-card">
                                    <div className="how-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                            <path d="m460-380 280-180-280-180v360ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Z" />
                                        </svg>
                                    </div>
                                    <h3>{t('home.howItWorks.step2.title')}</h3>
                                    <p>
                                        {t('home.howItWorks.step2.description')}
                                    </p>
                                </div>

                                {/* STEP 3: Practice with MCQs */}
                                <div className="how-card">
                                    <div className="how-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                            <path d="M360-240h400v-80H360v80Zm0-160h400v-80H360v80Zm-120 40q-33 0-56.5-23.5T160-440q0-33 23.5-56.5T240-520q33 0 56.5 23.5T320-440q0 33-23.5 56.5T240-360Zm0-160q-33 0-56.5-23.5T160-600q0-33 23.5-56.5T240-680q33 0 56.5 23.5T320-600q0 33-23.5 56.5T240-520ZM160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v640q0 33-23.5 56.5T800-80H160Z" />
                                        </svg>
                                    </div>
                                    <h3>{t('home.howItWorks.step3.title')}</h3>
                                    <p>
                                        {t('home.howItWorks.step3.description')}
                                    </p>
                                </div>

                            </div>

                        </div>
                    </section>

                    <section className="homePage_section3">
                        <div className="language-path-container">

                            {/* Section Heading */}
                            <div className="language-path-header">
                                <h2>{t('home.languagePath.title')}</h2>
                                <p>{t('home.languagePath.subtitle')}</p>
                            </div>

                            {/* Language Cards */}
                            <div className="language-path-grid">

                                {/* UI Language */}
                                <div className="language-card">
                                    <div className="language-icon ui">
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M4 5h16v3H4V5zm0 5h10v3H4v-3zm0 5h16v3H4v-3z" />
                                        </svg>
                                    </div>

                                    <h3>{t('home.languagePath.uiTitle')}</h3>
                                    <p>{t('home.languagePath.uiDescription')}</p>

                                    <div className="language-tags">
                                        <span>English</span>
                                        <span>Hindi</span>
                                        <span>Gujarati</span>
                                    </div>
                                </div>

                                {/* Learning Language */}
                                <div className="language-card highlight">
                                    <div className="language-icon learn">
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                     10-4.48 10-10S17.52 2 12 2zm6.93 9h-3.17a15.1
                     15.1 0 00-1.1-4.14A8.04 8.04 0 0118.93 11zM12
                     4c.9 1.32 1.6 3.16 1.94 5H10.06C10.4 7.16
                     11.1 5.32 12 4zM4.07 11a8.04 8.04 0 014.27-4.14
                     A15.1 15.1 0 007.24 11H4.07zm0 2h3.17c.25
                     1.46.66 2.86 1.1 4.14A8.04 8.04 0 014.07
                     13zm7.93 7c-.9-1.32-1.6-3.16-1.94-5h3.88
                     c-.34 1.84-1.04 3.68-1.94 5zm2.66-2.86
                     c.44-1.28.85-2.68 1.1-4.14h3.17a8.04
                     8.04 0 01-4.27 4.14z" />
                                        </svg>
                                    </div>

                                    <h3>{t('home.languagePath.learnTitle')}</h3>
                                    <p>{t('home.languagePath.learnDescription')}</p>

                                    <div className="language-tags">
                                        <span>English</span>
                                        <span>More Coming</span>
                                    </div>
                                </div>

                            </div>

                            {/* CTA */}
                            <div className="language-path-cta">
                                <button className="primary-btn">
                                    {t('home.languagePath.cta')}
                                </button>
                            </div>

                        </div>
                    </section>


                    <section className="homePage_section4">
                        <div className="learning-preview-container">

                            {/* Heading */}
                            <div className="learning-preview-header">
                                <h2>{t('home.learningPreview.title')}</h2>
                                <p>{t('home.learningPreview.subtitle')}</p>
                            </div>

                            {/* Preview Cards */}
                            <div className="learning-preview-grid">

                                {/* Word Card */}
                                <div className="preview-card">
                                    <span className="preview-label">
                                        {t('home.learningPreview.wordLabel')}
                                    </span>

                                    <h3>{t('home.learningPreview.word')}</h3>
                                    <p className="meaning">
                                        {t('home.learningPreview.meaning')}
                                    </p>

                                    <p className="example">
                                        “{t('home.learningPreview.example')}”
                                    </p>

                                    <button className="audio-btn" onClick={speakText}>
                                        <svg className="audio-icon" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M3 10v4h4l5 5V5L7 10H3z" />
                                            <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                        </svg>
                                        {t("home.learningPreview.listen")}
                                    </button>


                                </div>

                                {/* MCQ Card */}
                                <div className="preview-card mcq">
                                    <span className="preview-label">
                                        {t('home.learningPreview.mcqLabel')}
                                    </span>

                                    <h3>{t('home.learningPreview.mcqQuestion')}</h3>

                                    <ul className="mcq-options">
                                        <li>{t('home.learningPreview.options.option1')}</li>
                                        <li className="correct">
                                            {t('home.learningPreview.options.option2')}
                                        </li>
                                        <li>{t('home.learningPreview.options.option3')}</li>
                                    </ul>

                                    <span className="mcq-feedback">
                                        ✔ {t('home.learningPreview.correctFeedback')}
                                    </span>
                                </div>

                            </div>

                        </div>
                    </section>

                    <section className="homePage_section5">
                        <div className="progress-container">

                            {/* Left – Stats */}
                            <div className="progress-stats">

                                <div className="stat-card">
                                    <h3>120+</h3>
                                    <p>{t('home.progress.stats.words')}</p>
                                </div>

                                <div className="stat-card">
                                    <h3>85%</h3>
                                    <p>{t('home.progress.stats.accuracy')}</p>
                                </div>

                                <div className="stat-card">
                                    <h3>15</h3>
                                    <p>{t('home.progress.stats.days')}</p>
                                </div>

                            </div>

                            {/* Right – Content */}
                            <div className="progress-content">
                                <h2>{t('home.progress.title')}</h2>
                                <p>{t('home.progress.description')}</p>

                                <button className="primary-btn" onClick={onOpen}>
                                    {t('home.progress.cta')}
                                </button>
                            </div>

                        </div>
                    </section>




                </div>
            </main>
        </div>
    )
}

export default Home;