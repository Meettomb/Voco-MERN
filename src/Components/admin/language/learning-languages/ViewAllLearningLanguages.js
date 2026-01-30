
import { useState } from "react";
import { Link } from "react-router-dom";

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

  const [languages, setLanguages] = useState([
    {
      english: "English",
      native: "English",
      chapters: [{}, {}]
    },
    {
      english: "Hindi",
      native: "हिंदी",
      chapters: [{}, {}]
    }
  ]);

  return (
    <div className="learning-languages-page">

      <div className="learning-languages-page__card">

        <h2>Languages</h2>

        <table className="learning-languages-page__table">

          <thead>
            <tr>
              <th>#</th>
              <th>English</th>
              <th>Native</th>
              <th>Chapters</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {languages.map((lang, i) => (

              <tr key={i}>

                <td>{i + 1}</td>
                <td>{lang.english}</td>
                <td>{lang.native}</td>
                <td>{lang.chapters.length}</td>

                <td>
                  <div className="learning-languages-page__table-actions">

                    <Link to="/admin/language/learning-languages/view-learning-languages" className="learning-languages-page__view-btn">
                      <EyeIcon />
                      View
                    </Link>

                    <button className="learning-languages-page__icon-btn learning-languages-page__icon-btn--danger">
                      <TrashIcon />
                    </button>

                  </div>
                </td>


              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
