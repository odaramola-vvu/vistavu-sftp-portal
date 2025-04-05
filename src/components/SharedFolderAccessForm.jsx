import React, { useState } from 'react';

const SharedFolderAccessForm = () => {
  const [folderName, setFolderName] = useState('');
  const [usernames, setUsernames] = useState('');
  const [action, setAction] = useState('grant');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No token found. Please log in again.');
      return;
    }

    try {
      const response = await fetch('https://4l8tttgqqj.execute-api.us-west-2.amazonaws.com/dev/manage-shared-folder-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sharedFolder: folderName,
          users: usernames.split(',').map(name => name.trim())
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ Success: ${result.message || 'Folder access updated.'}`);
      } else {
        alert(`❌ Error: ${result.message || 'Something went wrong.'}`);
      }
    } catch (err) {
      console.error('Request failed:', err);
      alert('❌ Request failed. Check console for details.');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Manage Shared Folder Access</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Folder Name:
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            required
          />
        </label>
        <br /><br />
        <label>
          Action:
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="grant">Grant</option>
            <option value="revoke">Revoke</option>
          </select>
        </label>
        <br /><br />
        <label>
          Usernames (comma-separated):
          <input
            type="text"
            value={usernames}
            onChange={(e) => setUsernames(e.target.value)}
            required
          />
        </label>
        <br /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SharedFolderAccessForm;
