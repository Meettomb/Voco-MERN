import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import usePageTitle from '../../../../hooks/usePageTitle';
import axios from 'axios';
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../FullScreenLoader";

export default function UserDetailView() {
  usePageTitle("User Detail View");

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL
  
  const navigate = useNavigate();

  // TEMP dummy data (replace with API later)
  const { id } = useParams();
  const [user, setUser] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const location = useLocation()
  // const message = location.state?.message;
  // const messageType = location.state?.type;

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  useEffect(() => {

    if (location.state?.message) {

      setMessage(location.state.message);
      setMessageType(location.state.type);

      // remove state from history
      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }

  }, [location.state]);

  useEffect(() => {

    if (message) {

      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);

      return () => clearTimeout(timer);
    }

  }, [message]);

  const fetchUserDetails = async () => {
    try {
      const responce = await axios.get(`${REACT_APP_API_URL}/userModel/getUserDataById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setUser(responce.data.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

  const handleToggleActive = async () => {
    try {

      await axios.patch(
        `${REACT_APP_API_URL}/userModel/updateUserActiveStatus/${id}`,
        {
          isActive: !user.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setMessage(
        user.isActive
          ? "User deactivated successfully"
          : "User activated successfully"
      );

      setMessageType("success");

      fetchUserDetails();

    } catch (error) {

      setMessage("Failed to update status");
      setMessageType("error");

    }
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
      {!user && <FullScreenLoader />}
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
            <Link to={`/admin/users/manage-users/update-user-details/${id}`} className="icon-btn">
              <svg viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71
              7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003
              1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
              </svg>
            </Link>

            {/* Delete */}
            <div
              className={`toggle-switch ${user?.isActive ? "on" : "off"}`}
              onClick={handleToggleActive}
            >
              <div className="toggle-circle"></div>
            </div>

          </div>

        </div>

        {/* Card */}
        <div className="user-detail-card">

          <div className="detail-row">
            <span>ID</span>
            <p>{user?._id}</p>
          </div>

          <div className="detail-row">
            <span>Name</span>
            <p>{user?.username}</p>
          </div>

          <div className="detail-row">
            <span>Email</span>
            <p>{user?.email}</p>
          </div>

          <div className="detail-row">
            <span>Phone</span>

            <p className="phone-field">
              {user?.phoneNumber}

              {user?.phoneNumberVerified ? (
                // verified icon
                <svg
                  className="verify-icon success"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                // warning icon
                <svg className="verify-icon warning" viewBox="0 0 24 24">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-6h-2v4h2v-4z" />
                </svg>
              )}

            </p>
          </div>

          <div className="detail-row">
            <span>UI Language</span>
            <p>{user?.uiSupportLangauge}</p>
          </div>

          <div className="detail-row">
            <span>Learning Languages</span>
            <p>
              {user?.learningLanguages?.length > 0
                ? user.learningLanguages.map(lang => lang.english).join(',')
                : "None"}
            </p>
          </div>

          <div className="detail-row">
            <span>Status</span>
            <p className={`badge ${user?.isActive ? "active" : "deleted"}`}>
              {user?.isActive ? "Active" : "Deleted"}
            </p>
          </div>

          <div className="detail-row">
            <span>Role</span>
            <p>{user?.role}</p>
          </div>

          <div className="detail-row">
            <span>Created At</span>
            <p>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleString()
                : ""}
            </p>
          </div>

          <div className="detail-row">
            <span>Updated At</span>
            <p>
              {user?.updatedAt
                ? new Date(user.updatedAt).toLocaleString()
                : ""}
            </p>
          </div>

        </div>

      </div>
    </>
  );
}
