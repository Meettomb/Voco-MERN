import { Link, useNavigate } from "react-router-dom";

export default function UserDetailView() {

  const navigate = useNavigate();

  // TEMP dummy data (replace with API later)
  const user = {
    id: "U12345",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    status: "Active",
    role: "User",
    joined: "2025-01-15"
  };

  return (
    <div className="user-detail-page">

      {/* Top Bar */}
      <div className="user-detail-header">

        {/* Back */}
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <h2>User Details</h2>

        <div className="header-actions">

          {/* Edit */}
          <Link to="/admin/users/manage-users/update-user-details" className="icon-btn">
            <svg viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71
              7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003
              1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
            </svg>
          </Link>

          {/* Delete */}
          <button className="icon-btn danger">
            <svg viewBox="0 0 24 24">
              <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zm13-14h-3.5l-1-1h-5l-1
              1H5v2h14V5z"/>
            </svg>
          </button>

        </div>

      </div>

      {/* Card */}
      <div className="user-detail-card">

        <div className="detail-row">
          <span>ID</span>
          <p>{user.id}</p>
        </div>

        <div className="detail-row">
          <span>Name</span>
          <p>{user.name}</p>
        </div>

        <div className="detail-row">
          <span>Email</span>
          <p>{user.email}</p>
        </div>

        <div className="detail-row">
          <span>Phone</span>
          <p>{user.phone}</p>
        </div>

        <div className="detail-row">
          <span>Status</span>
          <p className={`status ${user.status.toLowerCase()}`}>
            {user.status}
          </p>
        </div>

        <div className="detail-row">
          <span>Role</span>
          <p>{user.role}</p>
        </div>

        <div className="detail-row">
          <span>Joined</span>
          <p>{user.joined}</p>
        </div>

      </div>

    </div>
  );
}
