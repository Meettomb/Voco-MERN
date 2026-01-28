import React from 'react'
import { Link } from 'react-router-dom';
import usePageTitle from '../../../hooks/usePageTitle';


export default function AllUsers() {
  usePageTitle("All Users");
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
                <Link to="/admin/users/manage-users/user-detail-view">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                  </svg>
                </Link>

              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>Meet Patel</td>
              <td>meet@example.com</td>
              <td>
                <span className="badge inactive">Inactive</span>
              </td>
              <td className="actions">

                {/* View */}
                <Link to="/admin/users/manage-users/user-detail-view">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                  </svg>
                </Link>

              </td>
            </tr>

          </tbody>

        </table>
      </div>

    </div>
  );
}

