import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import usePageTitle from '../../../../hooks/usePageTitle';
import axios from "axios";

/* Icons */

const EyeIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
  </svg>
);

export default function ViewAllLearningLanguages() {
  usePageTitle("View All Learning Languages");

  const [languages, setLanguages] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const location = useLocation();

   useEffect(() => {

    if (location.state?.message) {

      setMessage(location.state.message);
      setMessageType(location.state.type);

      // remove state from history
      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }

  }, [location.state]);

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
    getAllLearningLanguages();
  }, []);

  const getAllLearningLanguages = async () => {
    try {

      const response = await axios.get("http://localhost:5000/api/LearningLanguagesModel/getAllLearningLanguages");
      setLanguages(response.data.data)
    }
    catch (error) {
      console.log(error)
    }
  }

  const deleteLearningLangaugebyId = async (id) => {
    try {

      const responce = await axios.delete(`http://localhost:5000/api/LearningLanguagesModel/deleteLearningLangaugebyId/${id}`);
      if (responce.data.status === 1) {
        setMessage(responce.data.message);
        setMessageType("success");
        getAllLearningLanguages();
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
      <div className="learning-languages-page">

        <div className="learning-languages-page__card">

          <h2>Languages</h2>

          <table className="learning-languages-page__table">

            <thead>
              <tr>
                <th>#</th>
                <th>English</th>
                <th>Native</th>
                <th>Code</th>
                <th>Chapters</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {languages && languages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    No record found
                  </td>
                </tr>
              ) : (

                languages?.map((lang, index) => (

                  <tr key={lang._id}>

                    <td>{index + 1}</td>
                    <td>{lang?.english}</td>
                    <td>{lang?.native}</td>
                    <td>{lang?.code}</td>
                    <td>{lang?.chapters.length || 0}</td>

                    <td>
                      <div className="learning-languages-page__table-actions">

                        <Link to={`/admin/language/learning-languages/view-learning-languages/${lang._id}`} className="learning-languages-page__view-btn">
                          <EyeIcon />
                          View
                        </Link>

                        <button className="learning-languages-page__icon-btn learning-languages-page__icon-btn--danger"
                          onClick={() => deleteLearningLangaugebyId(lang._id)}>
                          <TrashIcon />
                        </button>

                      </div>
                    </td>


                  </tr>

                ))

              )}


            </tbody>

          </table>

        </div>

      </div>

    </>
  );
}
