import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { type Matrix, type Assessments} from "../../types/auth"

interface FetchedAssess{
  self:Assessments|null,
  team:Assessments[]|null,
}
const Assessment=()=>{
  const { user} = useSelector((state: RootState) => state.auth);
  const [skillMatrix,setSkillMatrix]=useState<Matrix[]>([]);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  
  const [assess,setAssess] = useState<FetchedAssess>();
  const [showRatingSection, setShowRatingSection] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ratingsArray = skillMatrix.map(matrix => ({
        skill_matrix_id: matrix.skill_matrix_id,
        employee_rating: ratings[matrix.skill_matrix_id] || 0
      }));

      await fetch(`http://localhost:3001/api/emp/matrix/rate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ratingsArray)
      });
      alert("Ratings submitted!");
      setShowRatingSection(false);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  const handleRatingChange = (skill_matrix_id: number, value: number) => {
    setRatings(prev => ({ ...prev, [skill_matrix_id]: value }));
  };
  
  useEffect(()=>{
      const fetchAssess=async()=>{
      try{
        const res=await fetch(`http://localhost:3001/api/eval/getAssessbyRole/${user?.employee_id}`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({
            role_name:user?.role.role_name,
            team_id:user?.team_id
          })
        })
        if(!res.ok)
        {
          alert("Fetch was not successfull");
        }
        const data=await res.json();
        console.log(data.self);
        console.log(data.team[0]);
        setAssess(data);
      }
      catch(err)
      {
        console.error(err);
      }
    }
    fetchAssess()
    },[user?.employee_id])

    const handleAssessment = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/eval/matricesByAssess/${assess?.self?.assessment_id}`);
        if (res.ok) {
          const data = await res.json();
          setSkillMatrix(data);
          setShowRatingSection(true);
        }
        else{
          setSkillMatrix([]);
          setShowRatingSection(false);
        }
      } catch (err) {
        console.error("Failed to fetch skill matrix:", err);
      }
    };
    return(
      <div className="p-4">
        <div>
            This is the Assessment
        </div>
        <button className="bg-violet-500 text-white rounded-md ml-2 hover:bg-violet-700 cursor-pointer p-2" onClick={handleAssessment}>Start Assessment</button>
        {showRatingSection && (
          <div className="flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
              <h2 className="text-2xl font-semibold text-violet-700 mb-4 border-b pb-2 text-center">Rate Skills</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {skillMatrix.length > 0 ? (
                  skillMatrix.map((matrix) => (
                    <div key={matrix.skill_matrix_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                      <label className="font-medium text-gray-800 flex-grow pr-4">Skill: {matrix.skill.skill_name}</label>
                      <div className="flex items-center gap-2 w-32">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={ratings[matrix.skill_matrix_id] || 0}
                          onChange={(e) =>
                            handleRatingChange(matrix.skill_matrix_id, parseInt(e.target.value))
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                          required
                        />
                        <span className="text-gray-700 font-semibold w-6 text-right">
                          {ratings[matrix.skill_matrix_id] || 0}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-10">No skills available for rating.</p>
                )}
                <button type="submit" className="w-full py-3 px-6 rounded-lg font-semibold shadow-md transition-colors duration-200 bg-green-600 hover:bg-green-700 text-white">
                  Submit Ratings
                </button>
              </form>
            </div>
          </div>
        )}
       </div>
    )
}

export default Assessment;