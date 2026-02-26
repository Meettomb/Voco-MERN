import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import usePageTitle from '../../../hooks/usePageTitle';

export default function ManageMcq() {

  usePageTitle("Manage MCQs");
  // 🔹 Dummy Data (Replace with API later)

  const navigate = useNavigate();
  const [mcqs] = useState([
    {
      id: 1,
      chapter: "Basics",
      difficulty: "Easy",
      question: {
        en: "What is the capital of France?",
        hi: "फ्रांस की राजधानी क्या है?"
      }
    },
    {
      id: 2,
      chapter: "Travel",
      difficulty: "Medium",
      question: {
        en: "Which airport is the busiest in the world?",
        hi: "दुनिया का सबसे व्यस्त हवाई अड्डा कौन सा है?"
      }
    }
  ]);

  const [search, setSearch] = useState("");

  // 🔹 Filtered MCQs
  const filteredMcqs = useMemo(() => {
    return mcqs.filter(mcq =>
      mcq.chapter.toLowerCase().includes(search.toLowerCase()) ||
      mcq.difficulty.toLowerCase().includes(search.toLowerCase()) ||
      mcq.question.en.toLowerCase().includes(search.toLowerCase())
    );
  }, [mcqs, search]);

  const navigateToPage = () => {
    navigate("/admin/mcq/add");
  }
  return (
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
            {filteredMcqs.length === 0 ? (
              <tr>
                <td colSpan="5" className="managemcq-page__no-data">
                  No MCQs found
                </td>
              </tr>
            ) : (
              filteredMcqs.map((mcq, index) => (
                <tr key={mcq.id}>
                  <td>{index + 1}</td>
                  <td>{mcq.chapter}</td>
                  <td>{mcq.difficulty}</td>
                  <td>
                    {mcq.question.en.length > 60
                      ? mcq.question.en.slice(0, 60) + "..."
                      : mcq.question.en}
                  </td>
                  <td className="managemcq-page__action-buttons">

                      {/* View */}
                      <Link
                        to="/admin/mcq/view"
                        className="manage-mcq__icon-btn edit"
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </Link>

                      {/* Edit */}
                      <Link
                        to="/admin/mcq/edit"
                        className="manage-mcq__icon-btn edit"
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </Link>

                      {/* Delete */}
                      <button className="manage-mcq__icon-btn delete">
                        <svg viewBox="0 0 24 24">
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                        </svg>
                      </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}