// src/components/Dashboard.tsx
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const Dashboard = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <div className='h-14 m-2 rounded-md bg-slate-400 '>
        <div className='flex justify-end m-1'>
          <div className='mx-2 my-4 '>Contacts</div>
          <div className=' p-2'><AccountCircleRoundedIcon sx={{ width: 40, height: 40, color: 'white'}} ></AccountCircleRoundedIcon></div>
          
        </div>
      </div>

      <p>Logged in as: {user?.employee_name}</p>
      <p>HR: {user?.hr?.employee_name || 'None'}</p>
      <p>Team ID: {user?.team?.team_id ?? 'None'}</p>
      <p>JWT: {token}</p>
    </div>
  );
};

export default Dashboard;
