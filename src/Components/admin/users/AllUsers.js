import React from 'react'

export default function AllUsers() {
  return (
    <div className="users-page">

      {/* Header */}
      <div className="users-header">
        <h1>All Users</h1>

        <input
          type="text"
          placeholder="Search users..."
          className="users-search"
        />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="users-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>1</td>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>
                <span className="badge active">Active</span>
              </td>
              <td className="actions">

                {/* View */}
                <button>
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
                  </svg>
                </button>

                {/* Edit */}
                <button>
                  <svg viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zM20.7 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>

                {/* Delete */}
                <button>
                  <svg viewBox="0 0 24 24">
                    <path d="M6 7h12M9 7V5h6v2m-7 3v9m4-9v9m4-9v9M5 7h14l-1 14H6L5 7z"/>
                  </svg>
                </button>

              </td>
            </tr>

          </tbody>

        </table>
      </div>

    </div>
  );
}

