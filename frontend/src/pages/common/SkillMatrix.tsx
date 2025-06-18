import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import SkillBarChart from "./SkillChart";


const SkillMatrix = () => {
  const [query, setQuery] = useState(0);
  const [year, setYear] = useState(0);
  const [modal, setModal] = useState(false);
  const [skillMatrix, setSkillMatrix] = useState<any[]>([]);
  const { user, token } = useSelector((state: RootState) => state.auth);
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
    if (!res) {
      return console.error("NOT INITIALIZED");
    }
    const data = await res.json();
    console.log(data);
    alert("Assessment was initiated successfully");
    setModal(false);
  };

  const fetchSkillMatrix = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/skill/getMatricesById/${user?.employee_id}`);
      const data = await res.json();
      console.log(data);
      setSkillMatrix(data);
    } catch (err) {
      console.error("Error fetching matrix", err);
    }
  };
  useEffect(() => {
    if (user?.role.role_name !== "HR") {
      fetchSkillMatrix();
    }
  }, [user]);

  return (
    <>
      <div className="m-1 text-2xl">Skill Matrix</div>

      {/* HR Button */}
      {user?.role.role_name === "HR" && (
        <button
          className="bg-violet-600 p-2 m-1 hover:bg-violet-400 rounded-md cursor-pointer text-white"
          onClick={() => setModal(true)}
        >
          Initiate Assessment
        </button>
      )}

      {/* Employee Table */}
      {user?.role.role_name !=="HR" && (
        <div className="overflow-x-auto mt-4">
          {skillMatrix.length > 0 ? (
            <table className="min-w-full border border-gray-300 text-sm text-center mt-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Role ↓ / Skill →</th>
                {skillMatrix.map((item) => (
                  <th key={item.skill_matrix_id} className="border px-4 py-2">
                    {item.skill.skill_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Employee Row */}
              <tr>
                <td className="border px-4 py-2 font-medium bg-blue-100">Your rating</td>
                {skillMatrix.map((item) => (
                  <td
                    key={`emp-${item.skill_matrix_id}`}
                    className={`border px-4 py-2 ${getColorByRating(item.employee_rating)}`}
                  >
                    {item.employee_rating}
                  </td>
                ))}
              </tr>
          
              {/* Lead Row */}
              <tr>
                <td className="border px-4 py-2 font-medium bg-green-100">Lead rating</td>
                {skillMatrix.map((item) => (
                  <td
                    key={`lead-${item.skill_matrix_id}`}
                    className={`border px-4 py-2 ${getColorByRating(item.lead_rating)}`}
                  >
                    {item.lead_rating}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          
            
          ) : (
            <p className="text-gray-600">No skill matrix found.</p>
          )}
        </div>
      )}
      {skillMatrix.length > 0 && <SkillBarChart skillMatrix={skillMatrix} />}


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
              <select
                className="w-full border p-2 rounded"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                <option value={0}>-- Select Year --</option>
                {Array.from({ length: 6 }, (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Select Quarter</label>
              <select
                className="w-full border p-2 rounded"
                value={query}
                onChange={(e) => setQuery(Number(e.target.value))}
              >
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
  );
};

export default SkillMatrix;
