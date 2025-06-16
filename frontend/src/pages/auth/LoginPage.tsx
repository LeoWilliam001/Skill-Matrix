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
    <>
    <div className='w-full min-h-screen  bg-linear-to-tr from-white-200 to-blue-400'>
      <h1 className='text-blue text-5xl text-center font-medium italic pt-12 text-black'>Skill Matrix</h1>
    <div className='flex md:justify-end justify-center  px-30 py-25 '>
      <div className='border-2 p-12 rounded-2xl bg-white '>
        <h1 className='text-center mb-8 font-medium text-blue-700 text-2xl'>Welcome Back</h1>
        <form onSubmit={handleLogin} className="flex flex-col w-80 mx-auto gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        </div>
        </div>
    </div>
    </>
  );
};

export default LoginPage;
