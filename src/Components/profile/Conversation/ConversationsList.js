
import React, { useCallback, useEffect, useState } from "react";
import {
  getConversationList,
  deleteConversation,
} from "../../../services/aiService";
import { useNavigate } from "react-router-dom";

export default function ConversationsList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const loadConversations = useCallback(async (targetPage) => {
    try {
      setLoading(true);
      setError("");

      const response = await getConversationList(targetPage);

      setConversations(response?.data || []);
      setPagination(response?.pagination || null);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load your conversations."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations(page);
  }, [page, loadConversations]);

  const handleDeleteConversation = async (conversationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(conversationId);
      setError("");

      await deleteConversation(conversationId);

      const remainingOnPage = conversations.length - 1;

      if (remainingOnPage === 0 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await loadConversations(page);
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
      setError(
        err.response?.data?.message ||
        "Unable to delete this conversation."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return "Duration unavailable";

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    if (
      Number.isNaN(startTime) ||
      Number.isNaN(endTime) ||
      endTime < startTime
    ) {
      return "Duration unavailable";
    }

    const minutes = Math.round((endTime - startTime) / 60000);

    return minutes < 1 ? "Less than 1 min" : `${minutes} min`;
  };

 
  return (
    <section className="conversation-list">
      <div className="conversation-list__header">
        <div className="conversation-list__heading">
          <span className="conversation-list__eyebrow">
            YOUR ACTIVITY
          </span>

          <h2 className="conversation-list__title">
            Conversation History
          </h2>

          <p className="conversation-list__description">
            Review your previous AI speaking practice sessions
            and track your progress.
          </p>
        </div>

        <div className="conversation-list__count">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M8 10h8M8 14h5M5 20l1.5-3H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 1.5 2.9L5 20Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>
            {pagination?.total ?? conversations.length}{" "}
            {(pagination?.total ?? conversations.length) === 1
              ? "conversation"
              : "conversations"}
          </span>
        </div>
      </div>

      {error && (
        <div className="conversation-list__state conversation-list__state--error">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="conversation-list__state">
          <div className="conversation-list__spinner" />
          <p>Loading your conversations...</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="conversation-list__empty">
          <div className="conversation-list__empty-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3a9 9 0 0 0-7.7 13.65L3 21l4.35-1.3A9 9 0 1 0 12 3Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M8 10h8M8 14h5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h3>No conversations yet</h3>
          <p>
            Your AI speaking practice sessions will appear here
            after you start practising with VOCO.
          </p>
        </div>
      ) : (
        <div className="conversation-list__items">
          {conversations.map((conversation, index) => {
            const score = conversation.performance?.overallScore;
            const hasScore =
              conversation.status === "completed" &&
              score !== null &&
              score !== undefined &&
              Number.isFinite(Number(score));

            return (
              <article
                className="conversation-list__item"
                key={conversation._id}
                onClick={() =>
                  navigate(`/SingleConversation/${conversation._id}`)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/SingleConversation/${conversation._id}`);
                  }
                }}
              >
                <div className="conversation-list__item-icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 3a9 9 0 0 0-7.7 13.65L3 21l4.35-1.3A9 9 0 1 0 12 3Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 10h8M8 14h5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="conversation-list__item-content">
                  <div className="conversation-list__item-heading">
                    <h3>
                      {conversation.language === "hi"
                        ? "Hindi Practice"
                        : "English Practice"}
                    </h3>

                    <span
                      className={`conversation-list__status conversation-list__status--${conversation.status}`}
                    >
                      {conversation.status === "completed"
                        ? "Completed"
                        : conversation.status === "analyzing"
                          ? "Analyzing"
                          : "In progress"}
                    </span>
                  </div>

                  <div className="conversation-list__metadata">
                    <span>
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="16"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <path
                          d="M16 3v4M8 3v4M3 10h18"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>
                      {formatDate(
                        conversation.startedAt || conversation.createdAt
                      )}
                    </span>

                    <span>
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <path
                          d="M12 7v5l3 2"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {formatDuration(
                        conversation.startedAt,
                        conversation.endedAt
                      )}
                    </span>

                    <span>
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M8 5h12M8 10h12M8 15h8M4 5h.01M4 10h.01M4 15h.01"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                      {conversation.messageCount ?? 0} messages
                    </span>
                  </div>
                </div>

                <div className="conversation-list__score">
                  <span>Overall score</span>
                  {hasScore ? (
                    <strong>
                      {Number(score)}
                      <small>/100</small>
                    </strong>
                  ) : (
                    <strong className="conversation-list__score-unavailable">
                      —
                    </strong>
                  )}
                </div>

                <span className="conversation-list__number">
                  {String((page - 1) * 5 + index + 1).padStart(2, "0")}
                </span>

                <button
                  type="button"
                  className="conversation-list__delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conversation._id);
                  }}
                  disabled={deletingId === conversation._id}
                  aria-label="Delete conversation"
                  title="Delete conversation"
                >
                  {deletingId === conversation._id ? (
                    <span>Deleting...</span>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      )}

      {!loading && pagination && pagination.totalPages > 1 && (
        <div className="conversation-list__pagination">
          <button
            type="button"
            className="conversation-list__page-button"
            onClick={() => setPage((current) => current - 1)}
            disabled={!pagination.hasPreviousPage}
          >
            Previous
          </button>

          <span className="conversation-list__page-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            type="button"
            className="conversation-list__page-button"
            onClick={() => setPage((current) => current + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
