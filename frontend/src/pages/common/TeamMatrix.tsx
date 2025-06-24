// src/components/TeamMatrix.tsx
import { useEffect, useState } from "react";
import TeamSkillChart from "./TeamSkillChart"; // Import the new chart component

interface Position {
  position_id: number;
  position_name: string;
}

interface Skill {
  skill_id: number;
  skill_name: string;
  pos_id: number;
  position: Position;
}

interface SkillMatrixEntry {
  skill_matrix_id: number;
  skill_id: number;
  employee_rating: number;
  lead_rating: number;
  skill: Skill;
}

interface Designation {
  d_id: number;
  desig_name: string;
}

interface Employee {
  employee_id: number;
  employee_name: string;
  designation: Designation;
}

interface Assessment {
  assessment_id: number;
  employee_id: number;
  employee: Employee;
  skill_matrix: SkillMatrixEntry[];
}

const TeamSkillMatrix = () => {
  const [data, setData] = useState<Assessment[]>([]);
  const [positionFilter, setPositionFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("All");
  const [employeeFilter, setEmployeeFilter] = useState("All");
  const [designationFilter, setDesignationFilter] = useState("All");
  const [showChart, setShowChart] = useState(false); // State to toggle chart visibility


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/skill/getMatricesByLead/2"); // Make sure this lead ID is dynamic or from Redux
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching team matrix", err);
      }
    };

    fetchData();
  }, []);

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

  const allSkills: Skill[] = Array.from(
    new Map(
      data.flatMap(a => a.skill_matrix.map(s => [s.skill.skill_id, s.skill]))
    ).values()
  );

  const allPositions = Array.from(
    new Set(
      allSkills.map(s => s.position?.position_name).filter(Boolean)
    )
  );
  const uniquePositions = ["All", ...allPositions];

  const positionFilteredSkills = positionFilter === "All"
    ? allSkills
    : allSkills.filter(skill => skill.position?.position_name === positionFilter);

  const uniqueSkills = ["All", ...new Set(positionFilteredSkills.map(skill => skill.skill_name))];

  const filteredSkills = positionFilter === "All" && skillFilter === "All"
    ? allSkills
    : positionFilteredSkills.filter(skill =>
        skillFilter === "All" || skill.skill_name === skillFilter
      );

  const uniqueDesignations = ["All", ...new Set(data.map(a => a.employee.designation?.desig_name).filter(Boolean))];

  const filteredAssessments = data.filter(a => {
    const matchesPosition = positionFilter === "All" ||
      a.skill_matrix.some(sm => sm.skill.position?.position_name === positionFilter);

    const matchesSkill = skillFilter === "All" ||
      filteredSkills.some(fs => fs.skill_id === a.skill_matrix.find(sm => sm.skill.skill_id === fs.skill_id)?.skill.skill_id);

    const matchesEmployee = employeeFilter === "All" ||
      a.employee.employee_name === employeeFilter;

    const matchesDesignation = designationFilter === "All" ||
      a.employee.designation?.desig_name === designationFilter;

    return matchesPosition && matchesSkill && matchesEmployee && matchesDesignation;
  });

  const uniqueEmployees = ["All", ...new Set(filteredAssessments.map(a => a.employee.employee_name))];


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Team Skill Matrix</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="mr-2 font-medium">Filter by Position:</label>
          <select
            className="border px-2 py-1 rounded"
            value={positionFilter}
            onChange={e => {
              setPositionFilter(e.target.value);
              setSkillFilter("All");
              setEmployeeFilter("All");
            }}
          >
            {uniquePositions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Filter by Skill:</label>
          <select
            className="border px-2 py-1 rounded"
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
          >
            {uniqueSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Filter by Employee:</label>
          <select
            className="border px-2 py-1 rounded"
            value={employeeFilter}
            onChange={e => setEmployeeFilter(e.target.value)}
          >
            {uniqueEmployees.map(emp => (
              <option key={emp} value={emp}>{emp}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Filter by Designation:</label>
          <select
            className="border px-2 py-1 rounded"
            value={designationFilter}
            onChange={e => setDesignationFilter(e.target.value)}
          >
            {uniqueDesignations.map(desig => (
              <option key={desig} value={desig}>{desig}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowChart(!showChart)}
          className="ml-auto bg-violet-500 text-white px-4 py-2 rounded hover:bg-violet-600"
        >
          {showChart ? "Hide Chart" : "Show Chart"}
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <table className="min-w-full border border-gray-300 text-center text-sm table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Employee \ Skill</th>
              {filteredSkills.map(skill => (
                <th key={skill.skill_id} className="border px-4 py-2">
                  {skill.skill_name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAssessments.map(emp => (
              <tr key={emp.employee.employee_id}>
                <td className="border px-4 py-2 font-medium bg-blue-50">
                  {emp.employee.employee_name}
                </td>
                {filteredSkills.map(skill => {
                  const match = emp.skill_matrix.find(s => s.skill.skill_id === skill.skill_id);
                  const cellClass = match ? getColorByRating(match.lead_rating) : "";
                  return (
                    <td key={skill.skill_id} className={`border px-4 py-2 ${cellClass}`}>
                      {match ? match.lead_rating : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showChart && (
        <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
          <TeamSkillChart
            filteredAssessments={filteredAssessments}
            filteredSkills={filteredSkills}
          />
        </div>
      )}
    </div>
  );
};

export default TeamSkillMatrix;