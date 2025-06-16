// src/components/Navbar.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
// import { ROLES } from '../constants/roles'; 

interface NavbarProps {
  onNavigate: (section: string) => void; 
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    navigate('/');
    dispatch(logout());
  };

  if (!user) {
    return null; 
  }

  return (
    <div>
    <nav className="bg-violet-600 rounded-md p-4 shadow-md m-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Skill Matrix</div>
        <ul className="flex space-x-6 mt-2">
          <li>
            <button
              onClick={() => onNavigate('profile')}
              className="text-white hover:text-blue-200 cursor-pointer transition-colors duration-200 focus:outline-none"
            >
              My Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('skillUpgradeGuide')}
              className="text-white hover:text-blue-200 cursor-pointer transition-colors duration-200 focus:outline-none"
            >
              Skill Upgrade Guide
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('skillCriteria')}
              className="text-white hover:text-blue-200 cursor-pointer transition-colors duration-200 focus:outline-none"
            >
              Skill Criteria
            </button>
          </li>

          {((user.role.role_name === "HR") || (user.role.role_name==="Lead")) && (
            <>
              <li>
                <button
                  onClick={() => onNavigate('teamOverview')}
                  className="text-white hover:text-blue-200 cursor-pointer transition-colors duration-200 focus:outline-none"
                >
                  Team Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('viewEmp')}
                  className="text-white hover:text-blue-200 cursor-pointer transition-colors duration-200 focus:outline-none"
                >
                  View Employees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('skillMatrix')}
                  className="text-white hover:text-blue-200 cursor-pointer transition-colors duration-200 focus:outline-none"
                >
                  Skill Matrix
                </button>
              </li>
            </>
          )}

          <li className="flex items-center space-x-2">
            <AccountCircleRoundedIcon sx={{ width: 32, height: 32, color: 'white' }} />
            <span className="text-white text-lg hidden md:inline">{user.employee_name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-800 text-white font-semibold py-1 px-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
