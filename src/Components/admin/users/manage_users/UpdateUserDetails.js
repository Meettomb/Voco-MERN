import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UpdateUserDetails() {

  const navigate = useNavigate();

  // Static user data (UI only)
  const [formData, setFormData] = useState({
    id: "U12345",
    name: "John Doe",
    email: "john@example.com",
    role: "User"
  });

  const [error, setError] = useState("");

  // Handle role change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value
    });
  };

  // Save button
  const handleSave = () => {

    // Validation
    if (!formData.role) {
      setError("Role is required");
      return;
    }

    // Display in console
    console.log("Updated User Data:", formData);

    // Fake success
    alert("User role updated successfully!");

    // Redirect to detail page (PATH BASED)
    navigate("/admin/users/manage-users/user-detail-view");
  };

  return (
    <div className="update-user-page">

      {/* Header */}
      <div className="update-user-header">

        <button
          className="icon-btn"
          onClick={() =>
            navigate("/admin/users/manage-users/user-detail-view")
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
          <input type="text" value={formData.id} disabled />
        </div>

        <div className="form-row">
          <label>Name</label>
          <input type="text" value={formData.name} disabled />
        </div>

        <div className="form-row">
          <label>Email</label>
          <input type="text" value={formData.email} disabled />
        </div>

        <div className="form-row">
          <label>Role</label>
          <select value={formData.role} onChange={handleChange}>
            <option value="">Select role</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
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
              navigate("/admin/users/manage-users/user-detail-view")
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
  );
}
