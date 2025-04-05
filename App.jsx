import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import SharedFolderAccessForm from './components/SharedFolderAccessForm';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Portal: Shared Folder Access</h1>
      {user ? (
        <>
          <p>✅ Logged in as {user.username}</p>
          <SharedFolderAccessForm />
        </>
      ) : (
        <LoginForm onLogin={setUser} />
      )}
    </div>
  );
}

export default App;
