// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || res.statusText);
      }

      const { token } = await res.json();
      localStorage.setItem('jwt', token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Login failed: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>

        {error && (
          <div className="mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <label className="block mb-2">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border rounded focus:outline-none"
            placeholder="you@example.com"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded focus:outline-none"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
