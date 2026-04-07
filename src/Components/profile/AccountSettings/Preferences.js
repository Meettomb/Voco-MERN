import React from 'react'
import { useTranslation } from 'react-i18next';

export default function Preferences() {

    const [isEditing, setIsEditing] = React.useState(false);
    const { t } = useTranslation();

    return (
        // Preferences Tab Content
        <div>
            <div className="tab-content AcountSettings" id="preferencesTab">
                <form>
                    <div className="edit-header">
                        {!isEditing && (
                            <button type="button" onClick={() => setIsEditing(true)}
                                className="edit-btn"
                                title={t("Profile.Preferences.edit")}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                {t("Profile.Preferences.dailyGoal")}
                            </label>
                            <input type="text"
                                className="form-input"
                                placeholder={t("Profile.Preferences.setDailyGoal")}
                                disabled={!isEditing} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                                {t("Profile.Preferences.reminderTime")}
                            </label>
                            <input type="time"
                                className="form-input"
                                disabled={!isEditing} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                {t("Profile.Preferences.difficultyLevel")}
                            </label>
                            <select className="form-input" disabled={!isEditing}>
                                <option value="">{t("Profile.Preferences.selectDifficulty")}</option>
                                <option value="beginner">{t("Profile.Preferences.beginner")}</option>
                                <option value="intermediate">{t("Profile.Preferences.intermediate")}</option>
                                <option value="advanced">{t("Profile.Preferences.advanced")}</option>
                            </select>

                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" y1="19" x2="12" y2="22" />
                                </svg>
                                {t("Profile.Preferences.voicePractice")}
                            </label>
                            <input type="text"
                                className="form-input"
                                placeholder={t("Profile.Preferences.voiceSettings")}
                                disabled={!isEditing} />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="action-buttons">
                            <button type="submit" className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>{t("Profile.Preferences.savePreferences")}</span>
                            </button>
                            <button type="button"
                                className="btn btn-secondary"
                                onClick={() => setIsEditing(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="1 4 1 10 7 10" />
                                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                </svg>
                                <span>{t("Profile.Preferences.cancel")}</span>
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
