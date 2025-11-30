import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form, setForm] = useState({ name:'', email:'', password:'', employeeId:'', department:''});
  const [role, setRole] = useState('employee');
  const nav = useNavigate();
  const onChange = (k, v) => setForm(prev=>({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', {...form, role});
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded shadow bg-white dark:bg-[#4c0f75] dark:text-white">
      <h2 className="text-xl font-semibold mb-4">Register</h2>

      <form onSubmit={submit} className="space-y-3">

        <input value={form.name} onChange={e=>onChange('name', e.target.value)}
          placeholder="Full name"
          className="w-full p-2 border rounded bg-gray-50 dark:bg-purple-900" />

        <input value={form.email} onChange={e=>onChange('email', e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded bg-gray-50 dark:bg-purple-900" />

        <input value={form.password} type="password" onChange={e=>onChange('password', e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded bg-gray-50 dark:bg-purple-900" />

        <input value={form.employeeId} onChange={e=>onChange('employeeId', e.target.value)}
          placeholder="Employee ID"
          className="w-full p-2 border rounded bg-gray-50 dark:bg-purple-900" />

        <input value={form.department} onChange={e=>onChange('department', e.target.value)}
          placeholder="Department"
          className="w-full p-2 border rounded bg-gray-50 dark:bg-purple-900" />

        <div className="flex gap-4 items-center">
          <label className="text-sm">Role:</label>
          <select value={role} onChange={e=>setRole(e.target.value)}
            className="p-2 border rounded bg-gray-50 dark:bg-purple-900">
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
}
