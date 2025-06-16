// src/components/Dashboard.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import NavBar from './NavBar';
import Profile from './Profile';
import SkillCriteria from './SkillCriteria';
import SkillMatrix from './SkillMatrix';
import UpgradeGuide from './UpgradeGuide';
import TeamData from './TeamData';
import ViewEmp from '../hr/ViewEmp';

const Dashboard = () => {
  const { user} = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  const [activeSection, setActiveSection] = React.useState('profile'); 

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'profile':
        return <Profile />;
      case 'teamOverview':
        if (user.role.role_name === "HR" || user.role.role_name==="Lead") {
          return <TeamData />;
        }
        return <p className="text-red-500 p-4">Access Denied to Team Overview</p>;
      case 'skillCriteria':
          return <SkillCriteria />;
      case 'skillMatrix':
          return <SkillMatrix />;
      case 'skillUpgradeGuide': 
        return <UpgradeGuide />;
      case 'viewEmp':
        if (user.role.role_name === "HR") {
          return <ViewEmp />;
        }
        return <p className="text-red-500 p-4">Access Denied to Team Overview</p>;
      default:
        return <Profile/>;
    }
  };

  return (
    <div>
      <NavBar onNavigate={setActiveSection}/>
      <div className="bg-white h-132 overflow-auto border-2 mt-4 m-2 rounded-lg shadow-md">
          {renderDashboardContent()}
        </div>
    </div>
  );
};

export default Dashboard;

