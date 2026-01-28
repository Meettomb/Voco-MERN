import { useEffect, useState } from "react";
import FullScreenLoader from "./FullScreenLoader";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import usePageTitle from "../hooks/usePageTitle";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

/* Chapter → Playlist mapping */
const PLAYLISTS = {
    chapter1: {
        title: "Vocabulary Basics",
        id: "PLcetZ6gSk96-FECmH9l7Vlx5VDigvgZpt",
    },
    chapter2: {
        title: "Easy Conversations",
        id: "PLcetZ6gSk96-XmVQ1xpU3ziEtQvczLpJt",
    },
    chapter3: {
        title: "Pronunciation",
        id: "PLD6B222E02447DC07",
    },
};

function Videos() {
    const { t } = useTranslation();
    usePageTitle("Videos");

    const [activeChapter, setActiveChapter] = useState("chapter1");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* Fetch videos when chapter changes */
    useEffect(() => {
        async function fetchVideos() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId=${PLAYLISTS[activeChapter].id}&key=${API_KEY}`
                );

                if (!response.ok) {
                    throw new Error("YouTube API request failed");
                }

                const data = await response.json();
                setVideos(data.items || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load videos");
                setVideos([]);
            } finally {
                setLoading(false);
            }
        }

        fetchVideos();
    }, [activeChapter]);

    /* Lock scroll while loading */
    useEffect(() => {
        document.body.style.overflow = loading ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [loading]);

    return (
        <div className="videos-page">
            <h1>{t("Videos.title")}</h1>

            {/* Chapter Selector */}
            <div className="chapter-tabs">
                {Object.keys(PLAYLISTS).map((key) => (
                    <button
                        key={key}
                        className={`chapter-btn ${activeChapter === key ? "active" : ""
                            }`}
                        onClick={() => setActiveChapter(key)}
                    >
                        {PLAYLISTS[key].title}
                    </button>
                ))}
            </div>

            {/* Loader */}
            {loading && <FullScreenLoader />}

            {/* Error */}
            {error && <p>{error}</p>}

            {/* Videos Grid */}
            <div className="videos-grid">
                {!loading &&
                    videos?.map((video) => (
                        <Link
                            key={video.id}
                            className="video-card"
                            to={`/video/${video.snippet.resourceId.videoId}`}>

                            <div className="thumb-wrapper">
                                <img
                                    src={video.snippet.thumbnails.medium.url}
                                    alt={video.snippet.title}
                                    className="video-thumb"
                                />
                                <span className="play-icon">▶</span>
                            </div>

                            <p className="video-title">{video.snippet.title}</p>
                        </Link>
                    ))}
            </div>
        </div>
    );
}

export default Videos;
