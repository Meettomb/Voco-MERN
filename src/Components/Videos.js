import { useEffect, useState } from "react";
import FullScreenLoader from './FullScreenLoader';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

// Map chapters to playlist IDs
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
    const [activeChapter, setActiveChapter] = useState("chapter1");
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchVideos() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=12&playlistId=${PLAYLISTS[activeChapter].id}&key=${API_KEY}`
                );

                const data = await response.json();
                setVideos(data.items);
            } catch (err) {
                console.error(err);
                setError("Failed to load videos");
            } finally {
                setLoading(false);
            }
        }

        fetchVideos();
    }, [activeChapter]);
    useEffect(() => {
        document.body.style.overflow = loading ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [loading]);


    return (
        <div className="videos-page">
            <h1>English Learning Videos</h1>

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

            {/* States */}
            {loading && <FullScreenLoader />}

            {error && <p>{error}</p>}

            {/* Videos */}
            <div className="videos-grid">
                {!loading &&
                    videos.map((video) => (
                        <div className="video-card">
                            <div className="thumb-wrapper">
                                <img
                                    src={video.snippet.thumbnails.medium.url}
                                    alt={video.snippet.title}
                                    className="video-thumb"
                                />
                                <span className="play-icon">▶</span>
                            </div>

                            <p className="video-title">{video.snippet.title}</p>
                        </div>

                    ))}
            </div>
        </div>
    );
}

export default Videos;
