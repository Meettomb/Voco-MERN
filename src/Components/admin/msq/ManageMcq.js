import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import usePageTitle from '../../../hooks/usePageTitle';
import axios from "axios";

export default function ManageMcq() {

  usePageTitle("Manage MCQs");

  const addLazyLoading = (html) => {
    if (!html) return "";

    return html.replace(/<img(?![^>]*loading=)/g, '<img loading="lazy"');
  };

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL
  const navigate = useNavigate();
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("");
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {

    const timer = setTimeout(() => {
      setSearchText(search);
    }, 400);

    return () => clearTimeout(timer);

  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [difficulty, searchText]);
  useEffect(() => {
    fetchMcqs(difficulty, searchText, currentPage);
  }, [difficulty, searchText, currentPage]);
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

  const fetchMcqs = async (diff = "", key = "", page = 1) => {
    try {
      setLoading(true);

      let url = `${REACT_APP_API_URL}/McqsModel/getAllMcqs`;

      if (key) {
        url = `${REACT_APP_API_URL}/McqsModel/searchMcqs`;

        const params = new URLSearchParams({
          key,
          page,
          limit: itemsPerPage
        });

        url = `${url}?${params.toString()}`;
      }

      else if (diff) {
        url = `${REACT_APP_API_URL}/McqsModel/getAllMcqsByDifficulty/${diff}?page=${page}&limit=${itemsPerPage}`;
      }

      else {
        url = `${REACT_APP_API_URL}/McqsModel/getAllMcqs?page=${page}&limit=${itemsPerPage}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.data.status === 1) {
        setMcqs(res.data.data);

        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalItems(res.data.pagination?.totalItems || 0);
      } else {
        setMcqs([]);
        setTotalPages(1);
        setTotalItems(0);
      }

    } catch (error) {
      console.error("Fetch MCQ error:", error);

      setMcqs([]);
      setTotalPages(1);
      setTotalItems(0);

    } finally {
      setLoading(false);
    }
  };


  const navigateToPage = () => {
    navigate("/admin/mcq/add");
  }


  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginationPages = () => {
  const pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
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

                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>

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
                          // dangerouslySetInnerHTML={{
                          //   __html: firstQuestion?.question?.en || ""
                          // }}
                          dangerouslySetInnerHTML={{
                            __html: addLazyLoading(firstQuestion?.question?.en || "")
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
          
          <div className="managemcq-page__pagination">

            <div className="managemcq-page__pagination-info">
              Showing {mcqs.length} of {totalItems} MCQs
            </div>

            <div className="managemcq-page__pagination-controls">

              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>

              {getPaginationPages().map((page, index) => {

  if (page === "...") {
    return (
      <span
        key={`dots-${index}`}
        className="pagination-dots"
      >
        ...
      </span>
    );
  }

  return (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`pagination-btn ${
        currentPage === page ? "active" : ""
      }`}
    >
      {page}
    </button>
  );
})}

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>

            </div>

          </div>
        </div>
      </div>

    </>
  );
}