import {useEffect} from "react";
import heroImage from '../assets/images/hero-visual.png'
import usePageTitle from '../hooks/usePageTitle';
import { useTranslation } from 'react-i18next'

function Home() {
 
    usePageTitle("Learn Languages");
    const { t } = useTranslation();

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
                                    <button className="primary-btn">{t('home.hero-section.cta.primary')}</button>
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
                    


                </div>
            </main>
        </div>
    )
}

export default Home;