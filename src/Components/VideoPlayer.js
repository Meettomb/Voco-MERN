import { useParams } from "react-router-dom";
import { useState } from "react";

function VideoPlayer() {
  const { id } = useParams();
  const [bookmarked, setBookmarked] = useState(false);

  function handleBookmark() {
    setBookmarked(!bookmarked);
  }

  return (
    <div className="video-player-page">
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
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
      </div>
    </div>
  );
}

export default VideoPlayer;
