// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

interface NavbarProps {
  onNavigate: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // State for dropdown visibility
  const profileMenuRef = useRef<HTMLLIElement>(null); // Ref for detecting clicks outside
  const [assess,setAssess] = useState(false);
  useEffect(()=>{
      const fetchAssess=async()=>{
      try{
        const res=await fetch(`http://localhost:3001/api/eval/assessByEmp/${user?.employee_id}`)
        if(res.ok)
        {
          setAssess(true);
        }
      }
      catch(err)
      {
        console.error(err);
      }
    }
    fetchAssess()
    },[])

  const handleLogout = () => {
    navigate('/');
    dispatch(logout());
    setShowProfileMenu(false); // Close menu on logout
  };

  const handleProfileClick = () => {
    onNavigate('profile');
    setShowProfileMenu(false); // Close menu on profile navigation
  };

  // Effect to handle clicks outside the profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  if (!user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-violet-600 rounded-md p-4 shadow-lg m-2">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-white text-3xl font-extrabold mb-4 md:mb-0">Skill Matrix</div>
        <ul className="flex flex-wrap justify-center md:flex-nowrap space-x-4 md:space-x-6 items-center text-sm md:text-base">
          <li>
            <button
              onClick={() => onNavigate('skillUpgradeGuide')}
              className="text-white hover:text-violet-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 rounded-md px-2 py-1"
            >
              Skill Upgrade Guide
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('skillCriteria')}
              className="text-white hover:text-violet-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 rounded-md px-2 py-1"
            >
              Skill Criteria
            </button>
          </li>

          {assess && (<li>
            <button
              onClick={() => onNavigate('assessment')}
              className="text-white hover:text-violet-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 rounded-md px-2 py-1"
            >
              Assessment
            </button>
          </li>)}

          {((user.role.role_name === "HR") || (user.role.role_name==="Lead")) && (
            <>
              <li>
                <button
                  onClick={() => onNavigate('teamOverview')}
                  className="text-white hover:text-violet-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 rounded-md px-2 py-1"
                >
                  Team Overview
                </button>
              </li>
              {user.role.role_name === "HR" && (
                <>
              <li>
                <button
                  onClick={() => onNavigate('viewEmp')}
                  className="text-white hover:text-violet-200 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 rounded-md px-2 py-1"
                >
                  View Employees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hrApprovals')}
                  className="text-white hover:text-violet-200 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 rounded-md px-2 py-1"
                >
                  Approvals
                </button>
              </li>
              </>
              )}
              <li>
                <button
                  onClick={() => onNavigate('skillMatrix')}
                  className="text-white hover:text-violet-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 rounded-md px-2 py-1"
                >
                  Skill Matrix
                </button>
              </li>
            </>
          )}

          {/* Profile Icon and Dropdown */}
          <li className="relative flex items-center space-x-2 mt-4 md:mt-0 ml-4" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 text-white hover:text-violet-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75 rounded-md px-2 py-1"
              aria-expanded={showProfileMenu ? "true" : "false"}
              aria-haspopup="true"
            >
              <AccountCircleRoundedIcon sx={{ width: 32, height: 32, color: 'white' }} />
              <span className="text-lg hidden md:inline font-semibold">{user.employee_name}</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 top-full w-28 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-violet-700"
                >
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 hover:text-violet-700"
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;