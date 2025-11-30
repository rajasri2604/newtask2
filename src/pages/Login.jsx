import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/dashboard');
    } catch (err) {
      setErr(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded shadow bg-white dark:bg-[#4c0f75] dark:text-white">
      <h2 className="text-xl font-semibold mb-4 text-purple-800">Login</h2>

      {err && <div className="text-red-300 mb-2">{err}</div>}

      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded bg-gray-50 dark:bg-purple-900" />

        <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded bg-gray-50 dark:bg-purple-900" />

        <button className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">Login</button>
      </form>

      <p className="mt-3 text-sm text-black">
        Don't have an account? <Link to="/register" className="text-purple-800">Register</Link>
      </p>
    </div>
  );
}
