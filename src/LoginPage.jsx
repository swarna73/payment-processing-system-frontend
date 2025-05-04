import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- ADD THIS

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // <-- INITIALIZE

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // store token
        setMessage("✅ Login successful!");
        navigate("/dashboard"); // <-- ✅ REDIRECT
      } else {
        setMessage("❌ Login error. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("❌ Login error. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "10px", margin: "10px", width: "200px" }}
        />
        <br />
        <input
          placeholder="Password"
          type="password"
          value={password}
          required
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", margin: "10px", width: "200px" }}
        />
        <br />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Login
        </button>
      </form>
      <div>{message}</div>
    </div>
  );
}

export default LoginPage;
