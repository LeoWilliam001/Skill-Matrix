import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { type Matrix, type Assessments } from "../../types/auth";

interface FetchedAssess {
  self: Assessments | null;
  team: Assessments[] | null;
}

const Assessment = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [skillMatrix, setSkillMatrix] = useState<Matrix[]>([]);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [assess, setAssess] = useState<FetchedAssess>();
  const [selectedAssessment, setSelectedAssessment] = useState<Assessments | null>(null);
  const [showRatingSection, setShowRatingSection] = useState(false);

  useEffect(() => {
    const fetchAssess = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/eval/getAssessbyRole/${user?.employee_id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role_name: user?.role.role_name, team_id: user?.team_id })
        });

        if (!res.ok) {
          alert("Fetch failed");
          return;
        }

        const data = await res.json();
        setAssess(data);
      } catch (err) {
        console.error("Assessment fetch error:", err);
      }
    };

    fetchAssess();
  }, [user?.employee_id]);

  const fetchSkillMatrix = async (assessment: Assessments) => {
    try {
      const res = await fetch(`http://localhost:3001/api/eval/matricesByAssess/${assessment.assessment_id}`);
      if (res.ok) {
        const data = await res.json();
        setSkillMatrix(data);
        setRatings({});
        setSelectedAssessment(assessment);
        setShowRatingSection(true);
      } else {
        setSkillMatrix([]);
        setShowRatingSection(false);
      }
    } catch (err) {
      console.error("Matrix fetch error:", err);
    }
  };

  const handleRatingChange = (skill_matrix_id: number, value: number) => {
    setRatings(prev => ({ ...prev, [skill_matrix_id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessment) return;

    const ratingsArray = skillMatrix.map(matrix => ({
      skill_matrix_id: matrix.skill_matrix_id,
      employee_rating: ratings[matrix.skill_matrix_id] || 0
    }));

    try {
      await fetch(`http://localhost:3001/api/eval/submitAssessbyRole/${user?.employee_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ratingsArray)
      });

      alert("Ratings submitted!");
      setShowRatingSection(false);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  return (
    <div className="p-4 flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3 w-full bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Assessment Actions</h2>
  
        {assess?.self && (
          <div className="mb-4">
            <h3 className="text-base font-medium">Self Assessment</h3>
            <button
              className="bg-violet-500 text-white w-full rounded-md px-4 py-2 mt-2 hover:bg-violet-700"
              onClick={() => fetchSkillMatrix(assess.self!)}
            >
              Start Self Assessment
            </button>
          </div>
        )}
  
        {assess?.team && assess.team.length > 0 && (
          <div>
            <h3 className="text-base font-medium mb-2">Team Assessments</h3>
            {assess.team.map((tm) => (
              <div key={tm.assessment_id} className="flex items-center justify-between bg-white p-2 rounded-md mb-2 shadow-sm">
                <div>Emp Name: {tm.employee.employee_name}</div>
                <button
                  className="bg-teal-500 text-white text-sm px-3 py-1 rounded-md hover:bg-teal-700"
                  onClick={() => fetchSkillMatrix(tm)}
                >
                  Rate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
  
      <div className="md:w-2/3 w-full">
        {showRatingSection ? (
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-violet-700 mb-4 border-b pb-2 text-center">
              Rate Skills (Assessment ID: {selectedAssessment?.assessment_id})
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {skillMatrix.length > 0 ? (
                skillMatrix.map((matrix) => (
                  <div key={matrix.skill_matrix_id} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                    <label className="font-medium text-gray-700 flex-1">Skill: {matrix.skill.skill_name}</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={ratings[matrix.skill_matrix_id] || 0}
                      onChange={(e) =>
                        handleRatingChange(matrix.skill_matrix_id, parseInt(e.target.value))
                      }
                      className="w-32 accent-violet-600"
                      required
                    />
                    <span className="w-6 text-right">{ratings[matrix.skill_matrix_id] || 0}</span>
                  </div>
                ))
              ) : (
                <p>No skills to rate.</p>
              )}
              <button
                type="submit"
                className="w-full py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Submit Ratings
              </button>
            </form>
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-12">Select an assessment to start rating.</div>
        )}
      </div>
    </div>
  );
  
};

export default Assessment;
