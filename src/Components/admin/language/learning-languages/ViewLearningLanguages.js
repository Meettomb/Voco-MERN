import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import usePageTitle from '../../../../hooks/usePageTitle';
import axios from "axios";

/* ========== SVG ICONS ========== */

const BackIcon = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

/* ========== COMPONENT ========== */

export default function ViewLearningLanguages() {
  usePageTitle("View Learning Language");
  const navigate = useNavigate();   // ✅ back navigation
  // const [search, setSearch] = useState("");

  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");


  // Static sample data
  const [language, setLangauage] = useState(null);

  useEffect(() => {
    getLearningLanguagesById();
  }, [id]);

  useEffect(() => {

    if (message) {

      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);

      return () => clearTimeout(timer);
    }

  }, [message]);


  const getLearningLanguagesById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/LearningLanguagesModel/getLearningLanguagesById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.data.status === 1) {
        setLangauage(response.data.data);
      }
      else {
        setMessage(response.data.message || "Faild to get data")
        messageType("error");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteLearningLangaugeChapterbyId = async (langId, chapterId) => {
    try {

      const response = await axios.delete(
        `http://localhost:5000/api/LearningLanguagesModel/deleteLearningLangaugeChapterbyId/${langId}/${chapterId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.status === 1) {

        setMessage(response.data.message);
        setMessageType("success");

        getLearningLanguagesById(); // refresh list

      } else {

        setMessage(
          response.data.message || "Failed to delete chapter"
        );

        setMessageType("error");
      }

    } catch (error) {
      console.log(error);
    }
  };

  const deleteLearningLangaugebyId = async (id) => {
    try {

      const responce = await axios.delete(`http://localhost:5000/api/LearningLanguagesModel/deleteLearningLangaugebyId/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (responce.data.status === 1) {
        setMessage(responce.data.message);
        setMessageType("success");
        navigate("/admin/language/learning-languages/view-all-learning-languages",
          {
            replace: true,
            state: {
              message: "Learning Langauge Deleted!",
              type: "success",
            },
          }
        );
      }
      else {
        setMessage(responce.data.message || "Faild to Delete Learning Langauge");
        setMessageType("error");
      }

    } catch (error) {
      console.log(error);
    }
  }

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

      <div className="view-lang-page">

        {/* HEADER */}
        <div className="view-lang-page__header">

          {/* BACK BUTTON */}
          <button
            className="view-lang-page__back-btn"
            onClick={() => navigate(-1)}
          >
            <BackIcon />
          </button>

          <h2>
            {language?.english} ({language?.native})
          </h2>

          <div className="view-lang-page__actions">

            {/* <div className="view-lang-page__search">
              <SearchIcon />
              <input
                placeholder="Search chapter..."
              // value={search}
              // onChange={(e) => setSearch(e.target.value)}
              />
            </div> */}

            <Link
              to={`/admin/language/learning-languages/update-learning-language/${id}`}
              className="view-lang-page__icon-btn edit"
            >
              <EditIcon />
            </Link>

            <button className="view-lang-page__icon-btn delete"
              onClick={() => deleteLearningLangaugebyId(id)} title="Delete langauge">
              <TrashIcon />
            </button>
          </div>

        </div>

        {/* CARD */}
        <div className="view-lang-page__card">

          <h3>Chapters</h3>

          <div className="view-lang-page__list">
            <div className="view-lang-page__list">

              {!language?.chapters || language.chapters.length === 0 ? (

                <div className="no-data">
                  No record found
                </div>

              ) : (

                language.chapters.map((ch, index) => (

                  <div key={index} className="view-lang-page__item">

                    <span>Chapter {index + 1}</span>

                    <div>
                      {Object.values(ch.translations).map((t, i) => (
                        <div key={i}>{t}</div>
                      ))}
                    </div>
                    <button className="view-lang-page__icon-btn delete"
                      onClick={() => deleteLearningLangaugeChapterbyId(language._id, ch._id)}>
                      <TrashIcon />
                    </button>
                  </div>


                ))

              )}

            </div>


          </div>

        </div>

      </div>
    </>
  );
}
