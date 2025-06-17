import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pass: password }),
    });

    const data = await res.json();

    if (res.ok) {
      dispatch(setCredentials(data));
      localStorage.setItem('token',data.token);
      navigate('/dashboard');
    } else {
      alert(data.message || 'Login failed');
    }
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-tr from-indigo-100 to-violet-400 flex flex-col items-center justify-center p-4'>
      <h1 className='text-white text-5xl text-center font-medium italic pt-12 mb-8 drop-shadow-lg'>Skill Matrix</h1>
      <div className='bg-white p-10 sm:p-12 rounded-2xl shadow-2xl border border-gray-200'>
        <h1 className='text-center mb-8 font-medium text-violet-700 text-2xl'>Welcome Back</h1>
        <form onSubmit={handleLogin} className="flex flex-col w-72 sm:w-80 mx-auto gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200 text-gray-800"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200 text-gray-800"
          />
          <button
            type="submit"
            className="bg-violet-700 text-white p-3 rounded-lg hover:bg-violet-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-75 active:bg-violet-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;