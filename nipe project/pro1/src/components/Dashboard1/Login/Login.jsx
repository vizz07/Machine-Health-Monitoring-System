import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'admin@dashboard.com' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', true);
      navigate('/dashboard');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login</h2>
        <p className="subtitle">Access your dashboard</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
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
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
