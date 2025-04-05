// ✅ App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import FileManager from "./components/FileManager";
import AdminDashboard from "./components/AdminDashboard"; // 🔜 create later

const App = () => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/file-manager"
          element={isAuthenticated ? <FileManager /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin-dashboard"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/file-manager" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
