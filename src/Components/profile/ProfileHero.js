import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import FullScreenLoader from '../FullScreenLoader';
import { useAuth } from '../../context/AuthContext';

export default function ProfileHero({ userData, uiLanguage }) {

    const { t } = useTranslation();
    const { setUserData } = useAuth();
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [profilePics, setProfilePics] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loadingImages, setLoadingImages] = useState(false);
    const [savingImage, setSavingImage] = useState(false);
    const [pickerError, setPickerError] = useState('');
    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
    const currentProfilePicId = userData?.profilePicId?._id || userData?.profilePicId;
    const avatarUrl = userData?.profilePicId?.imageUrl ||
        (typeof userData?.profilePicId === 'string' ? userData.profilePicId : null) ||
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria';

    useEffect(() => {
        if (!showAvatarPicker) return undefined;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !savingImage) {
                setShowAvatarPicker(false);
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showAvatarPicker, savingImage]);

    const openAvatarPicker = async () => {
        setSelectedImage(null);
        setPickerError('');
        setShowAvatarPicker(true);

        try {
            setLoadingImages(true);
            const response = await axios.get(
                `${REACT_APP_API_URL}/ProfilePicModel/getProfilePics`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.status !== 1) {
                throw new Error(response.data.message || 'Unable to load profile pictures.');
            }

            setProfilePics(response.data.data);
        } catch (error) {
            console.error('Error fetching profile pictures:', error);
            setPickerError(
                error.response?.data?.message ||
                error.message ||
                'Unable to load profile pictures.'
            );
        } finally {
            setLoadingImages(false);
        }
    };

    const saveAvatar = async () => {
        if (!selectedImage || !userData?._id) return;

        try {
            setSavingImage(true);
            const response = await axios.patch(
                `${REACT_APP_API_URL}/userModel/updateUserById/${userData._id}`,
                { profilePicId: selectedImage._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.data.status !== 1) {
                throw new Error(response.data.message || 'Unable to save profile picture.');
            }

            setUserData((currentUser) => ({
                ...currentUser,
                profilePicId: selectedImage,
            }));
            setShowAvatarPicker(false);
        } catch (error) {
            console.error('Error saving profile picture:', error);
            setPickerError(
                error.response?.data?.message ||
                error.message ||
                'Unable to save profile picture.'
            );
        } finally {
            setSavingImage(false);
        }
    };

    return (
        <>
            <div className="profile-hero">
                <div className="hero-content">
                    <div className="avatar-wrapper">
                        <img src={avatarUrl} alt="Profile Avatar" className="avatar" />
                        <button
                            type="button"
                            className="level-badge"
                            onClick={openAvatarPicker}
                            aria-label="Change profile picture"
                        >
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
                        </button>
                    </div>

                    <div className="hero-info">
                        <h1 id="userName">{userData?.username || t("Profile.ProfileHero.userNotFound")}</h1>
                        <div className="language-tags">
                            <span className="language-tag">
                                {/* {t("Profile.ProfileHero.uiLanguage")}: {userData?.uiSupportLangauge || "Not Specified"}</span><span className="language-tag"> */}
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

                                {t("Profile.ProfileHero.learning")}: {userData?.learningLanguages?.length > 0
                                    ? userData.learningLanguages.map(lang => lang.native).join(", ")
                                    : t("Profile.ProfileHero.notSpecified")}
                            </span>

                        </div>
                        {/* <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-value" id="stat1">127</div>
                                <div className="stat-label">{t("Profile.ProfileHero.dayStreak")}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value" id="stat2">2,847</div>
                                <div className="stat-label">{t("Profile.ProfileHero.wordsLearned")}</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value" id="stat3">48hrs</div>
                                <div className="stat-label">{t("Profile.ProfileHero.thisMonth")}</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {showAvatarPicker && createPortal(
                <>
                    <div
                        className="profile-avatar-picker-overlay"
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget && !savingImage) {
                                setShowAvatarPicker(false);
                            }
                        }}
                    >
                        <section
                            className="profile-avatar-picker"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="profile-avatar-picker-title"
                        >
                            <header className="profile-avatar-picker-header">
                                <div>
                                    <h2 id="profile-avatar-picker-title">Choose a profile picture</h2>
                                    <p>Select an image to use as your avatar.</p>
                                </div>
                                <button
                                    type="button"
                                    className="profile-avatar-picker-close"
                                    onClick={() => setShowAvatarPicker(false)}
                                    disabled={savingImage}
                                    aria-label="Close profile picture picker"
                                >
                                    &times;
                                </button>
                            </header>

                            {pickerError && (
                                <p className="profile-avatar-picker-error" role="alert">
                                    {pickerError}
                                </p>
                            )}

                            {loadingImages ? (
                                <p className="profile-avatar-picker-status">Loading profile pictures...</p>
                            ) : profilePics.length > 0 ? (
                                <div className="profile-avatar-picker-grid">
                                    {profilePics.map((image) => (
                                        <button
                                            type="button"
                                            key={image._id}
                                            className={`profile-avatar-option${selectedImage?._id === image._id ? ' selected' : ''}`}
                                            onClick={() => {
                                                setSelectedImage(image);
                                                setPickerError('');
                                            }}
                                            aria-pressed={selectedImage?._id === image._id}
                                        >
                                            <img src={image.imageUrl} alt="Available profile avatar" />
                                            {currentProfilePicId === image._id && (
                                                <span className="profile-avatar-current">Current</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : !pickerError ? (
                                <p className="profile-avatar-picker-status">
                                    No profile pictures are available yet.
                                </p>
                            ) : null}

                            <footer className="profile-avatar-picker-actions">
                                <button
                                    type="button"
                                    className="profile-avatar-cancel"
                                    onClick={() => setShowAvatarPicker(false)}
                                    disabled={savingImage}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="profile-avatar-save"
                                    onClick={saveAvatar}
                                    disabled={!selectedImage || savingImage}
                                >
                                    Save
                                </button>
                            </footer>
                        </section>
                    </div>
                    {savingImage && createPortal(
                        <FullScreenLoader message="Saving profile picture..." />,
                        document.body
                    )}
                </>,
                document.body
            )}
        </>
    )
}
