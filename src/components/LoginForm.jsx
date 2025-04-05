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
      console.log("🔐 Login successful:", user);

      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      // 🛰️ Check admin access using /check-admin
      const response = await fetch(
        "https://4l8tttgqqj.execute-api.us-west-2.amazonaws.com/dev/check-admin",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("🔎 Admin check result:", data);

      if (data.isAdmin) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin-dashboard");
      } else {
        localStorage.setItem("isAdmin", "false");
        navigate("/file-manager");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
