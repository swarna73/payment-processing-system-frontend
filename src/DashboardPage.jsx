import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const navigate = useNavigate();
const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [auditLogs, setAuditLogs] = useState([]);

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
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

fetch("http://localhost:8080/api/audit-logs", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setAuditLogs(data))
    .catch(err => console.error("Failed to fetch audit logs", err));
}, []);

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
const handleChangePassword = () => {
  const token = localStorage.getItem("token");

  fetch("http://localhost:8080/api/user/change-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Password change failed");
      return res.text();
    })
    .then((msg) => {
      alert(msg);
      setShowChangePasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
    })
    .catch((err) => {
      console.error("Password change error:", err);
      alert("Error changing password.");
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
        <button onClick={() => setShowChangePasswordForm(true)}>Change Password</button>
      </div>
      <br />
      <button onClick={handleLogout}>Logout</button>
<h3>🧾 Audit Log</h3>
<ul>
  {auditLogs.map((log, index) => (
    <li key={index}>
      {log.timestamp} — {log.action}
    </li>
  ))}
</ul>

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

{showChangePasswordForm && (
  <div style={{ marginTop: '20px' }}>
    <h2>Change Password</h2>
    <input
      type="password"
      placeholder="Current Password"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
      style={{ padding: '10px', marginBottom: '10px', width: '200px' }}
    />
    <br />
    <input
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      style={{ padding: '10px', marginBottom: '10px', width: '200px' }}
    />
    <br />
    <button onClick={handleChangePassword}>Save Password</button>
    <button onClick={() => setShowChangePasswordForm(false)} style={{ marginLeft: '10px' }}>Cancel</button>
  </div>
)}

    </div>
  );
}

