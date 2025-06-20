import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import SkillBarChart from "./SkillChart";
import TeamMatrix from "./TeamMatrix";

interface SkillMatrixProps {
  employeeId?: number;
  onClose?: () => void;
  showTeam: boolean;
}


const SkillMatrix = ({ employeeId, onClose, showTeam}: SkillMatrixProps) => {
  const [query, setQuery] = useState(0);
  const [year, setYear] = useState(0);
  const [modal, setModal] = useState(false);
  const [skillMatrix, setSkillMatrix] = useState<any[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[] | null>(null);
  const [positionFilter, setPositionFilter] = useState<string>("All");
  const { user, token } = useSelector((state: RootState) => state.auth);
  
  console.log(employeeId);

  const getColorByRating = (rating: number) => {
    switch (rating) {
      case 1: return "bg-red-300";
      case 2: return "bg-orange-200";
      case 3: return "bg-yellow-200";
      case 4: return "bg-lime-300";
      case 5: return "bg-green-300";
      default: return "";
    }
  };

  const handleAssessment = async () => {
    const res = await fetch("http://localhost:3001/api/admin/startAssess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ q_id: query, year }),
    });
    if (!res) return console.error("NOT INITIALIZED");
    alert("Assessment was initiated successfully");
    setModal(false);
  };

  const fetchSkillMatrix = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/skill/getMatricesById/${employeeId || user?.employee_id}`);
      const data = await res.json();
      console.log(data);
      setSkillMatrix(data);
    } catch (err) {
      console.error("Error fetching matrix", err);
    }
  };

  const handleLeadClick = async (skill_id: number, skill_name: string, rating: number) => {
    try {
      const thresholdRes = await fetch(`http://localhost:3001/api/skill/getDesigTarget/${user?.employee_id}`);
      const thresholds = await thresholdRes.json();
      const threshold = thresholds.find((t: any) => t.skill_skill_id === skill_id);
      if (!threshold) return alert("No threshold defined for this skill");

      const target = threshold.tv_threshold_value;
      const diff = rating - target;
      setSelectedSkill(skill_name);

      if (diff > 0) {
        setSuggestions([
          {
            guidance: "Your current rating exceeds the target. You may mentor others or prepare for advanced responsibilities.",
            resources_link: "#"
          }
        ]);
      } else if (diff < 0) {
        const guideRes = await fetch(`http://localhost:3001/api/skill/getUpgradeGuide/${skill_id}`);
        const fullGuide = await guideRes.json();
        const upgrades = fullGuide.filter((g: any) => g.from_level_id >= rating && g.to_level_id <= target);
        setSuggestions(upgrades);
      } else {
        setSuggestions([
          {
            guidance: "You are exactly at the target level. Maintain your consistency!",
            resources_link: "#"
          }
        ]);
      }
    } catch (err) {
      console.error("Threshold or upgrade guide error", err);
    }
  };

  useEffect(() => {
    if (user?.role.role_name !== "HR" || (user?.role.role_name === "HR"  && showTeam===false)) {
      fetchSkillMatrix();
    }
  }, [user]);

  const uniquePositions = [
    "All",
    ...Array.from(new Set(skillMatrix.map(item => item.skill.position?.position_name).filter(Boolean)))
  ];

  const filteredMatrix = positionFilter === "All"
    ? skillMatrix
    : skillMatrix.filter(item => item.skill.position?.position_name === positionFilter);

  return (
    <div className="p-4">
      <div className="m-1 text-2xl">Skill Matrix</div>
      {onClose && (
        <button
          className="absolute top-2 right-4 text-gray-600 hover:text-red-600 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
      )}

      {/* HR View */}
      {user?.role.role_name === "HR" && showTeam!==false && (
        <>
          <button
            className="bg-violet-600 p-2 m-1 hover:bg-violet-400 rounded-md cursor-pointer text-white"
            onClick={() => setModal(true)}
          >
            Initiate Assessment
          </button>

          {modal && (
            <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg relative">
                <button
                  className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
                  onClick={() => setModal(false)}
                >
                  ×
                </button>
                <h2 className="text-xl font-semibold mb-4">Initiate Assessment</h2>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Select Year</label>
                  <select className="w-full border p-2 rounded" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                    <option value={0}>-- Select Year --</option>
                    {Array.from({ length: 6 }, (_, i) => {
                      const y = new Date().getFullYear() - i;
                      return <option key={y} value={y}>{y}</option>;
                    })}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Select Quarter</label>
                  <select className="w-full border p-2 rounded" value={query} onChange={(e) => setQuery(Number(e.target.value))}>
                    <option value={0}>-- Select Quarter --</option>
                    <option value={1}>Quarter 1</option>
                    <option value={2}>Quarter 2</option>
                    <option value={3}>Quarter 3</option>
                    <option value={4}>Quarter 4</option>
                  </select>
                </div>

                <button
                  onClick={handleAssessment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Start
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {(user?.role.role_name !== "HR" || (user?.role.role_name === "HR"  && showTeam===false))&& (
        <div className="flex flex-col border-2 border-violet-50 rounded-md p-2 shadow-md lg:flex-row lg:space-x-4 mt-4">
          <div className="lg:w-3/5 w-full flex flex-col space-y-6">

            <div className="mb-4">
              <label className="mr-2 text-sm font-medium text-gray-700">Filter by Position:</label>
              <select
                className="border px-3 py-1 rounded"
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
              >
                {uniquePositions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            {filteredMatrix.length > 0 ? (
              <div className="bg-white border-2 border-violet-400 p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm text-center">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2">Role ↓ / Skill →</th>
                      {filteredMatrix.map((item) => (
                        <th key={item.skill_matrix_id} className="border px-4 py-2">
                          {item.skill.skill_name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2 font-medium bg-blue-100">Your rating</td>
                      {filteredMatrix.map((item) => (
                        <td key={`emp-${item.skill_matrix_id}`} className={`border px-4 py-2 ${getColorByRating(item.employee_rating)}`}>
                          {item.employee_rating}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border px-4 py-2 font-medium bg-green-100">Lead rating</td>
                      {filteredMatrix.map((item) => (
                        <td
                          key={`lead-${item.skill_matrix_id}`}
                          onClick={() => handleLeadClick(item.skill.skill_id, item.skill.skill_name, item.lead_rating)}
                          className={`border px-4 py-2 cursor-pointer hover:underline ${getColorByRating(item.lead_rating)}`}
                          title="Click for guidance"
                        >
                          {item.lead_rating}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 p-4 text-center">No skill matrix found.</p>
            )}

            {filteredMatrix.length > 0 && (
              <div className="bg-white p-4 rounded-lg border-2 border-violet-400 shadow-md">
                <SkillBarChart skillMatrix={filteredMatrix} />
              </div>
            )}
          </div>

          <div className="lg:w-2/5 border-2 border-violet-400 w-full mt-6 lg:mt-0 bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-violet-600 mb-2">
              Upgrade Suggestions {selectedSkill && `for ${selectedSkill}`}
            </h3>
            {suggestions && suggestions.length > 0 ? (
              <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {suggestions.map((s, idx) => (
                  <li key={idx} className="p-3 bg-white border rounded-md">
                    <p className="text-sm text-gray-800">{s.guidance}</p>
                    {s.resources_link && (
                      <a href={s.resources_link} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline block mt-1">
                        View Resource
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">No guidance needed. You're on track!</p>
            )}
          </div>
        </div>
      )}
      {user?.role.role_name === "Lead" && showTeam!==false && (
        <TeamMatrix/>
      )}
    </div>
  );
};

export default SkillMatrix;
