import React, { useState } from 'react';
import Navbar from '../components/navbar';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Login successful');
        console.log('User:', data.user);
        window.location.href = '/'; 
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('An error occurred during login');
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-content">
        <div className="login-container">
          <h2>Welcome back</h2>

          <button
            className="google-btn"
            onClick={() =>
              window.location.href =
                'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email%20profile'
            }
          >
            <img src="https://www.google.com/favicon.ico" alt="Google Icon" />
            Continue with Google
          </button>

          <div className="or-divider">OR</div>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="show-password">
              <input
                type="checkbox"
                id="show-password"
                onChange={(e) => {
                  const type = e.target.checked ? 'text' : 'password';
                  document.getElementById('password').type = type;
                }}
              />
              <label htmlFor="show-password">Show password</label>
            </div>

            <button
              type="button"
              className="forgot-password"
              onClick={() => alert('Password reset functionality coming soon!')}
            >
              Forgot password?
            </button>

            <button type="submit" className="sign-in-btn">
              Sign in
            </button>
          </form>

          <a href="/signup" className="sign-up-link">
            New user? Sign up
          </a>
        </div>
      </main>
    </>
  );
}

export default Login;
