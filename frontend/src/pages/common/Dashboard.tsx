// src/components/Dashboard.tsx
import  { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import NavBar from './NavBar';
import Profile from './Profile';
import SkillCriteria from './SkillCriteria';
import SkillMatrix from './SkillMatrix';
import TeamData from './TeamData';
import ViewEmp from '../hr/ViewEmp';
import Assessment from './Assessment';
import HrApprovals from '../hr/Approvals';
import Dash from './Dash';

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [assess, setAssess] = useState(false);

  const [activeSection, setActiveSection] = useState(() => {
    const savedSection = localStorage.getItem('activeDashboardSection');
    return savedSection || 'dash';
  });

  useEffect(() => {
    const fetchAssess = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/eval/getAssessbyRole/${user?.employee_id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role_name: user?.role.role_name, team_id: user?.team_id })
        })
        if (res.ok) {
          setAssess(true);
        }
      }
      catch (err) {
        console.error(err);
      }
    }
    if (user) {
      fetchAssess();
    }
  }, [user]); 

  useEffect(() => {
    localStorage.setItem('activeDashboardSection', activeSection);
  }, [activeSection]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  const renderDashboardContent = () => {
    switch (activeSection) {
      case 'profile':
        return <Profile />;
      case 'teamOverview':
        if (user.role.role_name === "HR" || user.role.role_name === "Lead") {
          return <TeamData />;
        }
        return <p className="text-red-500 p-4 text-center text-lg font-semibold">Access Denied to Team Overview</p>;
      case 'skillCriteria':
        return <SkillCriteria />;
      case 'skillMatrix':
        return <SkillMatrix showTeam={user.role.role_name !== "employee" && true} />;
      case 'assessment':
        console.log(assess);
        if (assess && user.role.role_name !== "HR") {
          return <Assessment />;
        }
        return <p className="text-red-500 p-4 text-center text-lg font-semibold">Access Denied to take Assessments</p>;
      case 'viewEmp':
        if (user.role.role_name === "HR") {
          return <ViewEmp />;
        }
        return <p className="text-red-500 p-4 text-center text-lg font-semibold">Access Denied to View Employees</p>;
      case 'hrApprovals':
        if (user.role.role_name === "HR") {
          return <HrApprovals />;
        }
        return <p className="text-red-500 p-4 text-center text-lg font-semibold">Access Denied to HR Approvals</p>;
      case 'dash':
        return <Dash />;
      default:
        return <Dash />; 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar onNavigate={setActiveSection} />
      <div className="bg-white min-h-[calc(100vh-120px)] overflow-y-auto border border-gray-200 mt-4 mx-2 p-4 rounded-lg shadow-md">
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default Dashboard;