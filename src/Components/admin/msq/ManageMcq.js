import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import usePageTitle from '../../../hooks/usePageTitle';
import axios from "axios";

export default function ManageMcq() {

  usePageTitle("Manage MCQs");

  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("");
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {

    const timer = setTimeout(() => {
      setSearchText(search);
    }, 400);

    return () => clearTimeout(timer);

  }, [search]);

  useEffect(() => {
    fetchMcqs(difficulty, search);
  }, [difficulty, search]);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType(location.state.type);

      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  }, [location]);
  useEffect(() => {

    if (message) {

      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);

      return () => clearTimeout(timer);
    }

  }, [message]);

  const fetchMcqs = async (diff = "", key = "") => {
    try {

      let url = "http://localhost:5000/api/McqsModel/getAllMcqs";

      // search API
      if (key) {

        url = `http://localhost:5000/api/McqsModel/searchMcqs?key=${key}`;

      }

      // difficulty only
      else if (diff) {

        url = `http://localhost:5000/api/McqsModel/getAllMcqsByDifficulty/${diff}`;

      }

      const res = await axios.get(url);

      if (res.data.status === 1) {
        setMcqs(res.data.data);
      } else {
        setMcqs([]);
      }

    } catch (error) {

      console.error("Fetch MCQ error", error);

    } finally {

      setLoading(false);

    }
  };


  const navigateToPage = () => {
    navigate("/admin/mcq/add");
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
      <div className="managemcq-page">
        <div className="managemcq-page__card">

          <div className="managemcq-page__header">
            <h2>Manage MCQs</h2>

            <div className="managemcq-page__actions">
              <input
                type="text"
                placeholder="Search MCQ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {/* Difficulty Filter */}
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">All</option>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>


              <button className="managemcq-page__add-btn" onClick={navigateToPage}>
                + Add MCQ
              </button>
            </div>
          </div>

          <table className="managemcq-page__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Chapter</th>
                <th>Difficulty</th>
                <th>EN Question</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>

              ) : mcqs.length === 0 ? (

                <tr>
                  <td colSpan="5">No MCQs found</td>
                </tr>

              ) : (

                mcqs.map((mcq, index) => {

                  const firstQuestion = mcq.questions?.[0];

                  return (
                    <tr key={mcq._id}>

                      <td>{index + 1}</td>

                      {/* Chapter IDs */}
                      <td>
                        {mcq.chapterIds?.[0]?.translations?.en}
                      </td>

                      {/* Difficulty */}
                      <td>
                        {mcq.difficultyLevel}
                      </td>

                      {/* Question */}
                      <td>
                        <div className="mcq-question-preview"
                          dangerouslySetInnerHTML={{
                            __html: firstQuestion?.question?.en || ""
                          }}
                        />
                      </td>

                      <td className="managemcq-page__action-buttons">

                        {/* View */}
                        <Link
                          to={`/admin/mcq/view/${mcq._id}`}
                          className="manage-mcq__icon-btn edit"
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>

                        {/* Edit */}
                        <Link
                          to={`/admin/mcq/edit/${mcq._id}`}
                          className="manage-mcq__icon-btn edit"
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </Link>


                      </td>

                    </tr>
                  );

                })

              )}

            </tbody>


          </table>

        </div>
      </div>

    </>
  );
}