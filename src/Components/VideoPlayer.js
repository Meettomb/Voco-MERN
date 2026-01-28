import { useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

function VideoPlayer() {
    usePageTitle("Video Player");
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { id } = useParams();
    const [bookmarked, setBookmarked] = useState(false);

    function handleBookmark() {
        setBookmarked(!bookmarked);
    }

    return (
        <div className="video-player-page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <svg
                    className="back-icon"
                    viewBox="0 -960 960 960"
                    aria-hidden="true"
                >
                    <path d="M440-200 200-480l240-280v160h320v240H440v160Z" />
                </svg> {t("VideoPlayer.back")}
            </button>

            <div className="player-wrapper">
                <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title="Video Player"
                    allowFullScreen
                ></iframe>
            </div>

            <div className="video-actions">
                <button
                    className={`bookmark-btn ${bookmarked ? "active" : ""}`}
                    onClick={handleBookmark}
                >
                    {bookmarked ? t("VideoPlayer.bookmarked") : t("VideoPlayer.bookmark")}
                </button>
            </div>
        </div>
    );
}

export default VideoPlayer;
