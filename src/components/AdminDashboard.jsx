import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  const username = localStorage.getItem('username') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const goTo = (path) => () => {
    navigate(path);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Logged in as <span className="font-medium">{username}</span></p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={goTo('/file-manager')}
          className="p-6 bg-blue-100 hover:bg-blue-200 rounded-xl shadow text-left"
        >
          <h2 className="text-xl font-semibold">📁 File Manager</h2>
          <p className="text-gray-600 text-sm mt-1">View and manage your own files and folders</p>
        </button>

        <button
          onClick={goTo('/shared-folder-access')}
          className="p-6 bg-green-100 hover:bg-green-200 rounded-xl shadow text-left"
        >
          <h2 className="text-xl font-semibold">🔗 Shared Folder Access</h2>
          <p className="text-gray-600 text-sm mt-1">Grant or revoke access to shared folders</p>
        </button>

        <button
          onClick={() => alert('Coming soon!')}
          className="p-6 bg-yellow-100 hover:bg-yellow-200 rounded-xl shadow text-left"
        >
          <h2 className="text-xl font-semibold">👥 Manage Users</h2>
          <p className="text-gray-600 text-sm mt-1">Create, delete, and reset user passwords</p>
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
