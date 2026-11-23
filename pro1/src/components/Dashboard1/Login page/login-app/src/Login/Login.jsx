import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    const validUsername = 'admin@dashboard.com';
    const validPassword = 'admin123';

    if (username === validUsername && password === validPassword) {
      setSuccess(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid username or password.');
      setSuccess(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login to Dashboard</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>

        {errorMsg && <p className="error">{errorMsg}</p>}
        {success && <p className="success">Login successful! ✅</p>}
      </form>
    </div>
  );
}

export default Login;
