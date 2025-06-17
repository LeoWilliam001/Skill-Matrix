// import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/common/Dashboard';
import Unauthorized from './pages/auth/Unauthorized';
// import { setCredentials, logout } from './store/authSlice';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
