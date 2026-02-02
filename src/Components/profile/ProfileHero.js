import React from 'react';

export default function ProfileHero() {
    return (
        <>
            <div className="profile-hero">
                <div className="hero-content">
                    <div className="avatar-wrapper">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" alt="Profile Avatar" className="avatar" />
                        <div className="level-badge">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                        </div>

                    </div>
                    <div className="hero-info">
                        <h1 id="userName">Maria Rodriguez</h1>
                        <div className="language-tags">
                            <span className="language-tag">🇪🇸 Native: Spanish</span>
                            <span className="language-tag">🎯 Learning: English</span>
                        </div>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-value" id="stat1">127</div>
                                <div className="stat-label">Day Streak</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value" id="stat2">2,847</div>
                                <div className="stat-label">Words Learned</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value" id="stat3">48hrs</div>
                                <div className="stat-label">This Month</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
