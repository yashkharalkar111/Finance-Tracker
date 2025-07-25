import React, { useState } from 'react';
import Navbar from '../components/navbar';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signup successful!');
        console.log('User registered:', data);
        window.location.href = '/login';
      } else {
        alert(data.msg || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-content">
        <div className="signup-container">
          <h2>Create an Account</h2>

          <button
            className="google-btn"
            onClick={() =>
              window.location.href =
                'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=email%20profile'
            }
          >
            <img src="https://www.google.com/favicon.ico" alt="Google Icon" />
            Sign up with Google
          </button>

          <div className="or-divider">OR</div>

          <form className="signup-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="First Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password*"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="show-password">
              <input
                type="checkbox"
                id="showPassword"
                onChange={(e) => {
                  const type = e.target.checked ? 'text' : 'password';
                  document.getElementById('password').type = type;
                  document.getElementById('confirmPassword').type = type;
                }}
              />
              <label htmlFor="showPassword">Show password</label>
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">I agree to the terms and conditions</label>
            </div>

            <button type="submit" className="sign-up-btn">Sign Up</button>

            <a href="/login" className="sign-in-link">
              Already have an account? Sign in
            </a>
          </form>
        </div>
      </main>
    </>
  );
}

export default Signup;
