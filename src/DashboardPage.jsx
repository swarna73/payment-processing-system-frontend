import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
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
      .then(res => {
        if (res.status === 401) {
          navigate("/login");
        } else {
          return res.json();
        }
      })
      .then(data => {
        setProfile(data);
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Dashboard</h1>
      {profile ? (
        <>
          <p>Welcome, {profile.username}!</p>
          <p>Email: {profile.username}</p> {/* or profile.email if field available */}
          <p>Roles: {profile.authorities.map(a => a.authority).join(", ")}</p>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
