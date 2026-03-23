import React, { useEffect, useState } from "react";
import axios from "axios";
import usePageTitle from "../../../hooks/usePageTitle";
import { useParams, useNavigate } from "react-router-dom";
import FullScreenLoader from "../../FullScreenLoader"

export default function ViewWords() {

  usePageTitle("Words");
  const [loading, setLoading] = useState(false);
  const { chapterId } = useParams();

  const [words, setWords] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    if (message) {

      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);

      return () => clearTimeout(timer);
    }

  }, [message]);


  useEffect(() => {

    setLoading(true);

    axios
      .get("http://localhost:5000/api/LearningWordsModel/getLearningWords")
      .then(res => {

        const data = res.data.data.filter(
          w => w.chapterId === chapterId
        );

        setWords(data);

      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [chapterId]);

  const handleDelete = async () => {
    try {

      // if (!window.confirm("Delete all words?")) return;

      const response = await axios.delete(
        `http://localhost:5000/api/LearningWordsModel/deleteLearningWordsByChapterId/${chapterId}`
      );

      if (response.data.message) {

        navigate(
          `/admin/words/view/${response.data.languageId}`,
          {
            replace: true,
            state: {
              message: "Words deleted successfully",
              type: "success"
            }
          }
        );

      }

    } catch (error) {
      console.log(error);
    }
  };

  const EditChapter = () => {

    if (!words.length) return;

    const id = words[0]._id;

    navigate(`/admin/words/edit/${id}`);

  };


  return (
    <>
      {message && (
        <p
          className={`app-message ${messageType === "success" ? "success" : "error"
            }`}
        >
          {message}
        </p>
      )}
      {loading && <FullScreenLoader />}
      <div className="view-word">

        <div className="view-word__card">

          {/* HEADER */}
          <div className="view-word__header">

            <button
              className="view-word__back-btn"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <h2>Words</h2>

            <div className="view-word__actions">

              <button className="view-word__icon-btn edit" onClick={EditChapter}>
                <svg viewBox="0 0 24 24">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>

              <button className="view-word__icon-btn delete" onClick={handleDelete}>
                <svg viewBox="0 0 24 24">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                </svg>
              </button>

            </div>

          </div>


          {/* CONTENT */}
          <div className="view-word__content">

            {words.map(w => (

              <div key={w._id}>

                {/* TYPE */}
                <div className="view-word__row">
                  <span>Content Type</span>
                  <p>{w.contentType}</p>
                </div>


                {/* TEXT BLOCK */}
                {w.contentType === "TextBlock" &&

                  w.difficulties.map(d => (

                    <div key={d.level} className="view-word__section">

                      <div className="view-word__difficulty">
                        Difficulty: {d.level}
                      </div>


                      {d.words.map((word, i) => (

                        <div key={i} className="view-word__word-block">

                          <div className="view-word__row">
                            <span>English</span>
                            <p>{word.en}</p>
                          </div>

                          <div className="view-word__row">
                            <span>Hindi</span>
                            <p>{word.hi}</p>
                          </div>

                        </div>

                      ))}

                    </div>

                  ))

                }


                {/* TEXT AREA */}
                {w.contentType === "TextArea" && (

                  <div className="view-word__row">

                    <span>Grammar</span>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: w.grammarContent?.en
                      }}
                    />

                  </div>

                )}

              </div>

            ))}

          </div>

        </div>

      </div>
    </>

  );

}