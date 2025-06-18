import { useEffect, useState } from "react";

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
  const [skillMatrix, setSkillMatrix] = useState<SkillMatrix[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/emp/getMyTeam/2");
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
      const res = await fetch(`http://localhost:3001/api/eval/getSkillMatrixByEmp/${member.employee_id}`);
      if (!res.ok) throw new Error("Failed to fetch skill matrix");
      const data = await res.json();
      setSelectedMember(member);
      setSkillMatrix(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Skill Matrix Fetch Error:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-violet-700">Team Members</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.employee_id} className="bg-white p-6 rounded-xl shadow-md border">
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
                className="px-3 py-1 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded"
                onClick={() => handleViewSkillMatrix(member)}
              >
                View Skill Matrix
              </button>
              <button className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded">
                View Full Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-semibold text-violet-700 mb-4">
              {selectedMember.employee_name}'s Skill Matrix
            </h2>
            {skillMatrix.length > 0 ? (
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {skillMatrix.map((matrix) => (
                  <li key={matrix.skill_matrix_id} className="p-3 bg-gray-50 rounded-md border flex justify-between">
                    <div className="text-gray-800 font-medium">{matrix.skill.skill_name}</div>
                    <div className="text-sm text-gray-600">
                      Employee: <strong>{matrix.employee_rating}</strong> | Lead: <strong>{matrix.lead_rating}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No skill matrix found.</p>
            )}
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-lg font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamData;
