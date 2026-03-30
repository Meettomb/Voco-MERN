import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePageTitle from "../../../../hooks/usePageTitle";
import axios from "axios";

export default function UpdateUserDetails() {
  usePageTitle("Update User Details");
  const navigate = useNavigate();

  // Static user data (UI only)
  const [formData, setFormData] = useState({ role: "" });
  const [user, setUser] = useState(null);
  const { id } = useParams();

  const [error, setError] = useState("");


  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Handle role change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value
    });
  };

  useEffect(() => {

    if (message) {

      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);

      return () => clearTimeout(timer);
    }

  }, [message]);

  const fetchUserDetails = useCallback(async () => {
    try {
      const responce = await axios.get(
        `http://localhost:5000/api/userModel/getUserDataById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (responce.data.status === 1) {
        setUser(responce.data.data);
        setFormData({
          role: responce.data.data.role
        });
      }

    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Save button
  const handleSave = async () => {

    setError(""); // clear old error

    // Validation
    if (!formData.role) {
      setError("Role is required");
      return;
    }

    try {

      const response = await axios.patch(
        `http://localhost:5000/api/userModel/updateUserRoleById/${id}`,
        {
          role: formData.role
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response?.data?.status === 1) {

        navigate(
          `/admin/users/manage-users/user-detail-view/${id}`,
          {
            replace: true,
            state: {
              message: response.data.message || "User role updated successfully!",
              type: "success",
            },
          }
        );

      } else {

        setError(response.data.message || "Failed to update role");
        setMessage(response.data.message || "Failed to update role");
        setMessageType("error");

      }

    } catch (err) {

      console.log(err);

      setError("Failed to update user role");
      setMessage("Failed to update user role");
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
      <div className="update-user-page">

        {/* Header */}
        <div className="update-user-header">

          <button
            className="icon-btn"
            onClick={() =>
              navigate(`/admin/users/manage-users/user-detail-view/${id}`)
            }
          >
            ←
          </button>

          <h2>Update User Role</h2>

        </div>

        {/* Card */}
        <div className="update-user-card">

          <div className="form-row">
            <label>User ID</label>
            <input type="text" value={user?._id || ""} disabled />
          </div>

          <div className="form-row">
            <label>Name</label>
            <input type="text" value={user?.username || ""} disabled />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input type="text" value={user?.email || ""} disabled />
          </div>

          <div className="form-row">
            <label>Role</label>
            <select value={formData?.role || ""} onChange={handleChange}>
              {user?.role === 'user' ? (
                <>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </>
              ) : (
                <>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </>
              )}
            </select>
          </div>

          {error && (
            <p style={{ color: "red", marginTop: "8px" }}>
              {error}
            </p>
          )}

          <div className="form-actions">

            <button
              className="btn-cancel"
              onClick={() =>
                navigate(`/admin/users/manage-users/user-detail-view/${id}`)
              }
            >
              Cancel
            </button>

            <button className="btn-save" onClick={handleSave}>
              Save Changes
            </button>

          </div>

        </div>

      </div>
    </>
  );
}
