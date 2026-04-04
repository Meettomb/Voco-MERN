import { useEffect, useState } from "react";
import FullScreenLoader from "./FullScreenLoader";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import usePageTitle from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

/* Chapter → Playlist mapping */
const PLAYLISTS = {
  chapter1: {
    title: "Vocabulary Basics",
    languages: {
      en: {
        hi: "PLcetZ6gSk96-FECmH9l7Vlx5VDigvgZpt", // English vocab explained in Hindi
        en: "PLcetZ6gSk96-XmVQ1xpU3ziEtQvczLpJt", // English vocab in English
      },
      hi: {
        en: "PLcetZ6gSk96-XmVQ1xpU3ziEtQvczLpJt",
        hi: "PLcetZ6gSk96-FECmH9l7Vlx5VDigvgZpt",
      },
    },
  },

  chapter2: {
    title: "Easy Conversations",
    languages: {
      en: {
        hi: "PLR2GOVaoHO5_sLiJkL22AJWuWyvgQqeK1", // conversation Hindi explanation
        en: "PLcetZ6gSk96-XmVQ1xpU3ziEtQvczLpJt", // conversation English
      },
      hi: {
        en: "PLcetZ6gSk96-XmVQ1xpU3ziEtQvczLpJt",
        hi: "PLR2GOVaoHO5_sLiJkL22AJWuWyvgQqeK1",
      },
    },
  },

  chapter3: {
    title: "Pronunciation",
    languages: {
      en: {
        hi: "PLD6B222E02447DC07", // pronunciation basics (Hindi-friendly)
        en: "PLD6B222E02447DC07", // pronunciation (neutral English)
      },
      hi: {
        en: "PLD6B222E02447DC07",
        hi: "PLD6B222E02447DC07",
      },
    },
  },
};
function Videos() {
    const { t } = useTranslation();
    usePageTitle("Videos");

    const { userData, activeLanguage, uiLanguage } = useAuth();
    const [activeChapter, setActiveChapter] = useState("chapter1");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getPlaylistId = () => {
        if (!activeLanguage?.code || !uiLanguage?.code) return null;

        const chapter = PLAYLISTS[activeChapter];

        const activeCode = activeLanguage.code.toLowerCase();
        const uiCode = uiLanguage.code.toLowerCase();

        const playlist =
            chapter?.languages?.[activeCode]?.[uiCode] || // exact match
            chapter?.languages?.[activeCode]?.["en"] || // fallback UI → English
            null;

        // console.log("Active Language:", activeCode);
        // console.log("UI Language:", uiCode);
        // console.log("Resolved Playlist:", playlist);

        return playlist;
    };

    /* Fetch videos when chapter changes */
    useEffect(() => {
        const playlistId = getPlaylistId();

        if (!playlistId || !isValidPlaylistId(playlistId)) {
            console.log("❌ Invalid Playlist ID:", playlistId);
            setVideos([]);
            setError("Invalid or missing playlist ID");
            return;
        }

        async function fetchVideos() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId=${playlistId}&key=${API_KEY}`
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error("YouTube Error:", data);
                    throw new Error(data.error?.message || "YouTube API failed");
                }

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
    }, [activeChapter, activeLanguage?.code, uiLanguage?.code]);

    const isValidPlaylistId = (id) => {
        return typeof id === "string" && id.startsWith("PL") && id.length > 10;
    };

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
