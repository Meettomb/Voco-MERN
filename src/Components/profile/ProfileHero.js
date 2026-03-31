import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import getUser from '../../utils/getUser';

export default function ProfileHero() {
    const user = getUser();
    const id = user ? user.id : null;
    const [userData, setUserData] = useState();
    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/userModel/getUserDataById/${id}`,
                {

                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`

                    }
                }
            );
            if (response.data.status === 1) {
                setUserData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, [id])

    useEffect(() => {
        if (id) {
            fetchUserData();
        }
    }, [fetchUserData, id]);


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
                        <h1 id="userName">{userData?.username || "User Name not Found"}</h1>
                        <div className="language-tags">
                            <span className="language-tag">UI Language: {userData?.uiSupportLangauge || "Not Specified"}</span><span className="language-tag">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="18"
                                    height="18"
                                    fill="none"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >

                                    <defs>
                                        <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#ff7a18" />
                                            <stop offset="100%" stopColor="#ff0000" />
                                        </linearGradient>
                                    </defs>

                                    <circle cx="12" cy="12" r="10" stroke="url(#targetGradient)" />
                                    <circle cx="12" cy="12" r="6" stroke="url(#targetGradient)" />
                                    <circle cx="12" cy="12" r="2" stroke="url(#targetGradient)" />

                                </svg>

                                Learning: {userData?.learningLanguages.length > 0 ? userData.learningLanguages.join(", ") : "Not Specified"}
                            </span>

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
