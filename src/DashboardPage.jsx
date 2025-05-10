import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8080/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then(data => {
        console.log("Profile data:", data);
        setProfile(data);
        setUpdatedEmail(data.username);
      })
      .catch(err => {
        console.error("Error getting profile:", err);
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSubmitUpdate = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ email: updatedEmail })
    })
      .then(res => {
if (res.status === 204 || res.status === 200) {
          alert("Email updated. Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return null;
        }
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then(data => {
        if (data) {
          alert("Profile updated successfully!");
          setProfile(prev => ({ ...prev, username: updatedEmail }));
          setShowUpdateForm(false);
        }
      })
      .catch(err => {
        console.error("Update error:", err);
        alert("Error updating profile.");
      });
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {profile.username}!</p>
      <p>Email: {profile.username}</p>
      <p>
        Roles: {profile.authorities && profile.authorities.length > 0
          ? profile.authorities.map(a => a.authority).join(", ")
          : "No roles assigned"}
      </p>
      <div>
        <button onClick={() => setShowUpdateForm(true)}>Update Profile</button>{" "}
        <button onClick={() => alert("Change password coming soon")}>Change Password</button>
      </div>
      <br />
      <button onClick={handleLogout}>Logout</button>

      {showUpdateForm && (
        <div style={{ marginTop: "30px" }}>
          <h2>Update Email</h2>
          <input
            type="email"
            value={updatedEmail}
            onChange={e => setUpdatedEmail(e.target.value)}
            placeholder="New email"
            style={{ padding: "10px", marginBottom: "10px", width: "250px" }}
          />
          <br />
          <button onClick={handleSubmitUpdate}>Save Changes</button>{" "}
          <button onClick={() => setShowUpdateForm(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

