import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
      <p className="my-4">You do not have permission to access this page.</p>
      <Link to="/" className="text-blue-500 underline">Go to Home</Link>
    </div>
  );
};

export default Unauthorized;
