import React from "react";

export default function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-badge">ABOUT VOCO</span>

          <h1>Learn Languages. Build Confidence.</h1>

          <p>
            VOCO is an interactive language-learning platform designed to make
            language practice simple, engaging, and accessible anytime,
            anywhere.
          </p>

          <div className="about-hero-actions">
            <a href="/learn" className="about-primary-btn">
              Start Learning
            </a>

            <a href="/contact" className="about-secondary-btn">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <main className="about-container">
        <section className="about-intro about-card">
          <div className="about-section-label">WHO WE ARE</div>

          <h2>About VOCO</h2>

          <p>
            VOCO is a modern language-learning platform created to help users
            practice and improve their language skills through interactive
            lessons, exercises, quizzes, examinations, and technology-driven
            learning experiences.
          </p>

          <p>
            Our goal is to provide a simple and engaging environment where
            users can learn at their own pace, track their progress, and
            continuously improve their language abilities.
          </p>

          <p>
            VOCO combines traditional learning concepts with modern web
            technologies and artificial intelligence to create a more
            interactive learning experience.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="about-grid">
          <div className="about-card about-feature-card">
            <div className="about-icon about-icon-blue">
              🎯
            </div>

            <h2>Our Mission</h2>

            <p>
              To make language learning more accessible, interactive, and
              engaging by providing useful learning resources and technology
              that users can access from anywhere.
            </p>
          </div>

          <div className="about-card about-feature-card">
            <div className="about-icon about-icon-orange">
              🚀
            </div>

            <h2>Our Vision</h2>

            <p>
              To build a learning platform that helps people develop practical
              language skills through consistent practice, personalized
              learning experiences, and modern technology.
            </p>
          </div>
        </section>

        {/* What VOCO Offers */}
        <section className="about-card about-features-section">
          <div className="about-section-label">WHAT WE OFFER</div>

          <h2>Learning Features</h2>

          <p className="about-section-description">
            VOCO provides a range of features designed to support different
            stages of the language-learning journey.
          </p>

          <div className="about-features-grid">
            <div className="about-feature-item">
              <div className="about-feature-number">01</div>
              <div>
                <h3>Interactive Lessons</h3>
                <p>
                  Learn vocabulary, grammar, sentences, and other language
                  concepts through structured lessons.
                </p>
              </div>
            </div>

            <div className="about-feature-item">
              <div className="about-feature-number">02</div>
              <div>
                <h3>Practice & Exercises</h3>
                <p>
                  Practice what you learn with interactive questions and
                  learning activities.
                </p>
              </div>
            </div>

            <div className="about-feature-item">
              <div className="about-feature-number">03</div>
              <div>
                <h3>Quizzes & Exams</h3>
                <p>
                  Test your understanding through chapter quizzes, examinations,
                  and final assessments.
                </p>
              </div>
            </div>

            <div className="about-feature-item">
              <div className="about-feature-number">04</div>
              <div>
                <h3>Progress Tracking</h3>
                <p>
                  Track your learning progress and see how your performance
                  develops over time.
                </p>
              </div>
            </div>

            <div className="about-feature-item">
              <div className="about-feature-number">05</div>
              <div>
                <h3>AI-Assisted Learning</h3>
                <p>
                  Selected features use artificial intelligence to provide
                  additional learning and language-practice capabilities.
                </p>
              </div>
            </div>

            <div className="about-feature-item">
              <div className="about-feature-number">06</div>
              <div>
                <h3>Learning Achievements</h3>
                <p>
                  Complete learning activities, assessments, and milestones to
                  recognize your progress.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="about-card about-technology">
          <div className="about-section-label">TECHNOLOGY</div>

          <h2>Built With Modern Technology</h2>

          <p>
            VOCO is built using modern web technologies to provide a responsive
            and scalable learning platform.
          </p>

          <div className="about-tech-list">
            <span>React</span>
            <span>Node.js</span>
            <span>Express.js</span>
            <span>MongoDB</span>
            <span>REST API</span>
            <span>Artificial Intelligence</span>
          </div>
        </section>

        {/* Learning Philosophy */}
        <section className="about-learning">
          <div className="about-learning-content">
            <div className="about-section-label">OUR APPROACH</div>

            <h2>Learning Should Be Simple</h2>

            <p>
              Learning a new language takes time and consistent practice. VOCO
              is designed to make that process easier by bringing learning
              materials, practice, assessments, progress tracking, and
              technology together in one platform.
            </p>

            <p>
              We believe that users should be able to learn at their own pace,
              practice regularly, identify areas for improvement, and continue
              building their confidence through consistent learning.
            </p>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="about-disclaimer">
          <div className="about-disclaimer-icon">ℹ</div>

          <div>
            <h3>Important Information</h3>

            <p>
              VOCO is an educational platform. Learning materials and
              AI-generated content may contain inaccuracies or errors. Users
              should evaluate information independently before relying on it
              for important decisions.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div>
            <span className="about-section-label">START YOUR JOURNEY</span>

            <h2>Ready to Start Learning?</h2>

            <p>
              Explore VOCO and begin practicing your language skills today.
            </p>
          </div>

          <a href="/learn" className="about-cta-btn">
            Explore VOCO
          </a>
        </section>
      </main>
    </div>
  );
}