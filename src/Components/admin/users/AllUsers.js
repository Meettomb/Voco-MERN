import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import usePageTitle from '../../../hooks/usePageTitle';
import axios from 'axios';


export default function AllUsers() {
  usePageTitle("All Users");

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem('token')

  useEffect(() => {
    // Fetch users from API
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const respnce = await axios.get(`${REACT_APP_API_URL}/userModel/getUserData/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setUsers(respnce.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        console.error("Error fetching users:", error);
      }

    }
  }

  const handleSearch = async (value) => {

    setSearch(value);

    try {

      if (value.trim() === "") {
        fetchUsers();
        return;
      }

      const res = await axios.get(
        `${REACT_APP_API_URL}/userModel/searchUsers?keyword=${value}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setUsers(res.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="users-page">

      {/* Header */}
      <div className="users-header">
        <h1>All Users</h1>

        <input
          type="text"
          placeholder="Search users..."
          className="users-search"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
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

            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No record found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>

                  <td>
                    {user.isActive ? (
                      <span className="badge active">Active</span>
                    ) : (
                      <span className="badge deleted">Deleted</span>
                    )}
                  </td>

                  <td className="actions">
                    <Link
                      to={`/admin/users/manage-users/user-detail-view/${user._id}`}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                      </svg>
                    </Link>
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

