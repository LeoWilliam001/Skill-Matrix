// src/components/Dashboard.tsx
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

const Dashboard = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <p>Logged in as: {user?.employee_name}</p>
      <p>HR: {user?.hr?.employee_name || 'None'}</p>
      <p>Team ID: {user?.team?.team_id ?? 'None'}</p>
      <p>JWT: {token}</p>
    </div>
  );
};

export default Dashboard;
