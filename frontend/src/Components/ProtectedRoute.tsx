// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import type { JSX } from 'react';

interface Props {
  children: JSX.Element;
  allowedRoles: number[]; 
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || !allowedRoles.includes(user.role_id)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
