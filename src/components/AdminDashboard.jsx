import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  const username = localStorage.getItem('username') || 'Admin';

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const goTo = (path) => () => {
    navigate(path);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsers([]);
    setShowUserList(false);

    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch('/api/list-users', {
        method: 'POST',
        headers: {
          Authorization: token
        }
      });

      const data = await res.json();
      console.log('👥 List users response:', data);

      setUsers(data.users || []);
      setShowUserList(true);
    } catch (err) {
      console.error('❌ Failed to fetch users:', err);
    }

    setLoadingUsers(false);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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

        <button
          onClick={fetchUsers}
          className="p-6 bg-purple-100 hover:bg-purple-200 rounded-xl shadow text-left"
        >
          <h2 className="text-xl font-semibold">📋 List Users</h2>
          <p className="text-gray-600 text-sm mt-1">View all Cognito users</p>
        </button>
      </div>

      {loadingUsers && <p className="text-blue-500">Loading users...</p>}

      {showUserList && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
          <h3 className="text-lg font-semibold mb-2">👥 User List</h3>
          {users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-gray-800">
              {users.map((user) => (
                <li key={user.Username}>{user.Username}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
