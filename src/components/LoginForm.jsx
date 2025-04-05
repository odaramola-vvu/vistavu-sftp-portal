import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await Auth.signIn(username, password);
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      localStorage.setItem("token", token);
      localStorage.setItem("username", username); // Save for file actions

      // ✅ Call /check-admin to see if user is admin
      const response = await fetch("/api/check-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      const isAdmin = data?.isAdmin === true;
      localStorage.setItem("isAdmin", isAdmin);

      if (isAdmin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/file-manager");
      }
    } catch (err) {
      console.error("Login error", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h2>🔐 Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
