import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import FileManager from './components/FileManager';
import SharedFolderAccessForm from './components/SharedFolderAccessForm'; // Optional
import AdminDashboard from './components/AdminDashboard'; // Create this as needed

function AuthRedirector() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const isAdmin = localStorage.getItem('isAdmin');

    if (!token) {
      navigate('/login');
    } else if (isAdmin === 'true') {
      navigate('/admin-dashboard');
    } else {
      navigate('/file-manager');
    }
  }, [navigate]);

  return null;
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('jwtToken');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthRedirector />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/file-manager"
          element={
            <ProtectedRoute>
              <FileManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Optional route for managing shared folder access */}
        <Route
          path="/shared-folder-access"
          element={
            <ProtectedRoute>
              <SharedFolderAccessForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
