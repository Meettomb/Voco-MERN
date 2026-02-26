import React from "react";
import { Link } from "react-router-dom";
import usePageTitle from '../../../hooks/usePageTitle';

export default function ViewWord() {
  usePageTitle("View Learning Word");
  return (
    <div className="view-word">
      <div className="view-word__card">

        {/* Header */}
        <div className="view-word__header">

          {/* Back Button */}
          <button
            className="view-word__back-btn"
            onClick={() => window.history.back()}
          >
            <svg viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>

          <h2>Word Details</h2>

          <div className="view-word__actions">

            {/* Edit */}
            <Link to="/admin/words/edit" className="view-word__icon-btn edit">
              <svg viewBox="0 0 24 24">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </Link>

            {/* Delete */}
            <button className="view-word__icon-btn delete">
              <svg viewBox="0 0 24 24">
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
              </svg>
            </button>

          </div>
        </div>

        {/* Content */}
        <div className="view-word__content">

          <div className="view-word__row">
            <span>Chapter</span>
            <p>Basics</p>
          </div>

          <div className="view-word__row">
            <span>Difficulty</span>
            <p>Easy</p>
          </div>

          <div className="view-word__row">
            <span>English Word</span>
            <p>Hello</p>
          </div>

          <div className="view-word__row">
            <span>French Word</span>
            <p>Bonjour</p>
          </div>

        </div>

      </div>
    </div>
  );
}
