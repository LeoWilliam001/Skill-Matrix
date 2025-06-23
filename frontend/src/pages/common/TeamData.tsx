import { useEffect, useState } from "react";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import SkillMatrix from "./SkillMatrix";
import { FaEnvelopeOpenText, FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import type { Designation, HR, Role, Team } from "../../types/auth";

interface Skill {
  skill_name: string;
}

interface SkillMatrix {
  skill_matrix_id: number;
  skill: Skill;
  employee_rating: number;
  lead_rating: number;
}

interface TeamMember {
  employee_id: number;
  employee_name: string;
  email: string;
  age: number;
  gender: string;
  location: string;
  nationality: string;
  marital_status: string;
  designation: Designation;
  role: Role;
  hr: HR;
  team: Team;
}

const TeamData = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);


  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/emp/getMyTeam/${user?.employee_id}`);
        if (!res.ok) throw new Error("Failed to fetch team data");
        const data = await res.json();
        setTeam(data);
      } catch (err) {
        console.error("Error fetching team:", err);
      }
    };

    fetchTeam();
  }, [user?.employee_id]);

  const handleViewSkillMatrix = (member: TeamMember) => {
    setSelectedMember(member);
    setIsSkillModalOpen(true);
  };

  const handleViewFullProfile = (member: TeamMember) => {
    setSelectedMember(member);
    setIsProfileModalOpen(true);
  };

  const filteredTeam = team.filter(member =>
    member.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-violet-700">Team Members</h2>
      <div className="mb-4 flex">
      <FaSearch size={25} className="text-violet-600 mt-2 mr-2"/>
      <input
        type="text"
        placeholder="Search employee by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-1/4 border border-violet-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member) => (
          <div key={member.employee_id} className="bg-white p-6 rounded-xl shadow-md border-2 border-violet-400">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-violet-500 text-white flex items-center justify-center text-lg font-bold">
                {member.employee_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{member.employee_name}</h3>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-1 mb-4">
              <p><strong>Gender:</strong> {member.gender}</p>
              <p><strong>Age:</strong> {member.age}</p>
              <p><strong>Location:</strong> {member.location}</p>
              <p><strong>Nationality:</strong> {member.nationality}</p>
              <p><strong>Marital:</strong> {member.marital_status}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-3 py-1 flex flex-row items-center text-sm bg-white cursor-pointer hover:text-violet-700 text-violet-600 rounded border-2 border-violet-400"
                onClick={() => handleViewSkillMatrix(member)}
              >
                <FaEnvelopeOpenText size={18}/> <p className="ml-2">Skill Matrix</p>
              </button>
              <button
                className="px-3 py-1 flex flex-row items-center text-sm bg-white cursor-pointer hover:text-violet-700 text-violet-600 rounded border-2 border-violet-400"
                onClick={() => handleViewFullProfile(member)}
              >
                <CgProfile size={21}/> <p className="ml-2">View Full Profile</p>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isSkillModalOpen && selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50 overflow-y-auto p-4">
          <div className="bg-white w-[100] h-[90vh] overflow-y-auto p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-3xl font-bold leading-none"
              onClick={() => setIsSkillModalOpen(false)}
              aria-label="Close"
            >
            </button>
            <h2 className="text-xl font-semibold text-violet-700 mb-4">
              {selectedMember.employee_name}'s Skill Matrix
            </h2>
            <SkillMatrix employeeId={selectedMember.employee_id} onClose={() => setIsSkillModalOpen(false)} showTeam={false}/>
          </div>
        </div>
      )}

      {isProfileModalOpen && selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50 overflow-y-auto p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl relative border-4 border-violet-500 animate-zoom-in">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-4xl font-extrabold leading-none "
              onClick={() => setIsProfileModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-3xl font-extrabold text-violet-800 mb-8 text-center tracking-wide uppercase">
              {selectedMember.employee_name}'s Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-lg text-gray-800">
              <div className="space-y-4">
                <p className="font-bold text-gray-900 text-xl mb-2 border-b-2 border-violet-300 pb-2">Personal Information</p>
                <p><span className="font-semibold text-gray-700">Employee ID:</span> {selectedMember.employee_id}</p>
                <p><span className="font-semibold text-gray-700">Full Name:</span> {selectedMember.employee_name}</p>
                <p><span className="font-semibold text-gray-700">Email:</span> {selectedMember.email}</p>
                <p><span className="font-semibold text-gray-700">Age:</span> {selectedMember.age}</p>
                <p><span className="font-semibold text-gray-700">Gender:</span> {selectedMember.gender}</p>
              </div>

              <div className="space-y-4">
                <p className="font-bold text-gray-900 text-xl mb-2 border-b-2 border-violet-300 pb-2">Other Details</p>
                <p><span className="font-semibold text-gray-700">Location:</span> {selectedMember.location}</p>
                <p><span className="font-semibold text-gray-700">Nationality:</span> {selectedMember.nationality}</p>
                <p><span className="font-semibold text-gray-700">Marital Status:</span> {selectedMember.marital_status}</p>
                <p><span className="font-semibold text-gray-700">Designation:</span> {selectedMember.designation.desig_name ?? 'N/A'}</p>
                <p><span className="font-semibold text-gray-700">Role:</span> {selectedMember.role.role_name ?? 'N/A'}</p>
                <p><span className="font-semibold text-gray-700">HR:</span>{selectedMember.hr.employee_name ?? 'N/A'}</p>
                <p><span className="font-semibold text-gray-700">Team:</span> {selectedMember.team.team_name ?? 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamData;