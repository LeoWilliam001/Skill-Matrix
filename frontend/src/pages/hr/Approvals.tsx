import { useEffect, useState } from "react";
import { type User } from "../../types/auth";

interface SkillMatrix {
  skill_matrix_id: number;
  skill: { skill_name: string };
  lead_rating: number;
}

interface TeamAssessment {
  assessment_id: number;
  employee_id: number;
  employee:User;
  quarter: number;
  year: number;
  lead_comments: string;
  hr_approval: number;
  hr_comments: string;
  skill_matrix: SkillMatrix[];
}

const HrApprovals = () => {
  const [teamAssessments, setTeamAssessments] = useState<TeamAssessment[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/eval/getAssessbyRole/3", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role_name: "HR" })
        });
  
        if (!res.ok) {
          alert("Failed to fetch assessments");
          return;
        }
  
        const data = await res.json();
        console.log("Fetched assessment data:", data);
  
        if (Array.isArray(data.team)) {
          setTeamAssessments(data.team);
        } else {
          console.warn("Expected 'team' to be an array but got:", data.team);
          setTeamAssessments([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
  
    fetchAssessments();
  }, []);
  

  const handleApprove = async (assessment_id: number) => {
    const hrComment = comments[assessment_id];

    try {
      const res = await fetch(`http://localhost:3001/api/eval/hrApproval/${assessment_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comments: hrComment,
        })
      });

      if (res.ok) {
        alert("Approved successfully!");
        setTeamAssessments(prev => prev.filter(a => a.assessment_id !== assessment_id));
      } else {
        alert("Approval failed");
      }
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-violet-700">HR Approvals</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamAssessments.map(assess => (
          <div key={assess.assessment_id} className="bg-white p-5 shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Employee Name: {assess.employee.employee_name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Quarter: {assess.quarter}, Year: {assess.year}
            </p>

            <div className="mb-4">
              <h4 className="font-semibold text-violet-600 mb-2">Lead Ratings:</h4>
              {assess.skill_matrix.map((matrix) => (
                <div
                  key={matrix.skill_matrix_id}
                  className="flex justify-between items-center px-2 py-1 border-b"
                >
                  <span>{matrix.skill.skill_name}</span>
                  <span className="font-semibold">{matrix.lead_rating}/5</span>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1 text-gray-700">
                HR Comments:
              </label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={comments[assess.assessment_id] || ""}
                onChange={(e) =>
                  setComments((prev) => ({
                    ...prev,
                    [assess.assessment_id]: e.target.value
                  }))
                }
              ></textarea>
            </div>

            <button
              onClick={() => handleApprove(assess.assessment_id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full"
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HrApprovals;
