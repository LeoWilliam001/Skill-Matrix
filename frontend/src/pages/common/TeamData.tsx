import { useEffect, useState } from "react";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import SkillMatrix from "./SkillMatrix";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

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
}

const TeamData = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  // const [skillMatrix, setSkillMatrix] = useState<SkillMatrix[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  }, []);

  const handleViewSkillMatrix = async (member: TeamMember) => {
    try {
      setSelectedMember(member);
      setIsModalOpen(true);
      
    } catch (err) {
      console.error("Skill Matrix Fetch Error:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-violet-700">Team Members</h2>
      <div className="mb-4">
      <input
        type="text"
        placeholder="Search employee by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-1/4 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team
        .filter(member =>
          member.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((member) => (

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
                className="px-3 py-1 flex flex-row text-sm bg-white cursor-pointer hover:text-violet-700 text-violet-600 rounded border-2 border-violet-400"
                onClick={() => handleViewSkillMatrix(member)}
              >
                <FaEnvelopeOpenText size={18}/> <p className="ml-2">Skill Matrix</p>
              </button>
              <button className="px-3 py-1 flex flex-row text-sm bg-white cursor-pointer hover:text-violet-700 text-violet-600 rounded border-2 border-violet-400">
              <CgProfile size={21}/> <p className="ml-2">View Full Profile</p>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 overflow-y-auto">
          <div className="bg-white w-1/2 max-w-5xl h-[80vh] overflow-y-auto p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-semibold text-violet-700 mb-4">
              {selectedMember.employee_name}'s Skill Matrix
            </h2>

            <SkillMatrix employeeId={selectedMember.employee_id} onClose={() => setIsModalOpen(false)} showTeam={false}/>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeamData;
