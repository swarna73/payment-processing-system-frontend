import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [profile, setProfile] = useState(null);
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
      .then(res => res.json())
.then(data => {
  console.log("Profile data:", data);  // ✅ ADD THIS
  setProfile(data);
})	
      .catch(err => {
        console.error("Error fetching profile:", err);
        setProfile(null);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUpdateProfile = () => {
    alert("Update Profile clicked! (placeholder)");
    // navigate("/update-profile"); // example if you plan to add route
  };

  const handleChangePassword = () => {
    alert("Change Password clicked! (placeholder)");
    // navigate("/change-password"); // example if you plan to add route
  };

  if (!profile) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Dashboard</h1>
        <p>Loading profile...</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {profile.username}!</p>
      <p>Email: {profile.username}</p>
      <p>Roles: {profile.roles?.join(", ") || "No roles assigned"}</p>

      <button onClick={handleUpdateProfile} style={{ margin: "10px" }}>
        Update Profile
      </button>

      <button onClick={handleChangePassword} style={{ margin: "10px" }}>
        Change Password
      </button>

      <br />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default DashboardPage;
