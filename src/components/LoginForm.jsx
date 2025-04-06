import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

const handleLogin = async (e) => {
  e.preventDefault();
  setErrorMessage('');

  try {
    const user = await Auth.signIn(username, password);
    console.log('✅ Logged in:', user);

    const session = user.getSignInUserSession();
    const token = session.getIdToken().getJwtToken();

    localStorage.setItem('jwtToken', token);
    localStorage.setItem('username', username);

    console.log('🔐 Token stored, checking admin access...');

    const res = await fetch('/api/check-admin', {
      method: 'POST',
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();
    console.log('👑 Admin check result:', data);

    if (data.isAdmin) {
      localStorage.setItem('isAdmin', 'true');
      console.log('➡️ Redirecting to /admin-dashboard');
      window.location.href = '/admin-dashboard';
    } else {
      localStorage.setItem('isAdmin', 'false');
      console.log('➡️ Redirecting to /file-manager');
      window.location.href = '/file-manager';
    }

  } catch (err) {
    console.error('❌ Login or admin check failed:', err);
    setErrorMessage('Login failed. Check credentials or try again later.');
  }
};

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
