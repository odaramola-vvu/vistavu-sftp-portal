// ✅ LoginForm.jsx
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
      console.log("✅ Logged in:", user);

      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", user.getUsername());
      localStorage.setItem("token", idToken);

      // ✅ Call backend to check if user is admin
      const response = await fetch("/api/check-admin", {
        method: "POST",
        headers: {
          Authorization: idToken,
        },
      });

      const result = await response.json();
      const isAdmin = result?.isAdmin === true;

      localStorage.setItem("isAdmin", isAdmin);

      // ✅ Redirect
      if (isAdmin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/file-manager");
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>🔐 Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default LoginForm;
