import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedEmail, setUpdatedEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Profile fetch failed");
        return res.json();
      })
      .then((data) => {
        console.log("Profile data:", data);
        setProfile(data);
        setUpdatedEmail(data.username);
      })
      .catch((err) => {
        console.error("Error getting profile:", err);
        alert("Error getting profile. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: updatedEmail }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        if (res.status === 204) {
          alert("Email updated. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return {};
        }
        return res.json();
      })
      .then((data) => {
        alert("Profile updated successfully!");
        setProfile((prev) => ({ ...prev, username: updatedEmail }));
        setShowUpdateForm(false);
      })
      .catch((err) => {
        console.error("Update error:", err);
        alert("Error updating profile.");
      });
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {profile.username}!</p>
      <p>Email: {profile.username}</p>
      <p>Roles: {profile.authorities?.map((a) => a.authority).join(", ") || "No roles assigned"}</p>
      <button onClick={() => setShowUpdateForm(true)}>Update Profile</button>
      <button onClick={() => alert("Change password clicked")}>Change Password</button>
      <br />
      <br />
      <button onClick={handleLogout}>Logout</button>

      {showUpdateForm && (
        <div style={{ marginTop: "20px" }}>
          <h3>Update Email</h3>
          <form onSubmit={handleSubmitUpdate}>
            <input
              type="email"
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
              required
              style={{ padding: "10px", margin: "10px", width: "200px" }}
            />
            <br />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setShowUpdateForm(false)} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;

