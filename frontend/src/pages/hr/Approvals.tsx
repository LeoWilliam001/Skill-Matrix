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
        // NOTE: Hardcoded employee_id 3. Consider making this dynamic based on logged-in HR user.
        const res = await fetch("http://localhost:3001/api/eval/getAssessbyRole/3", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role_name: "HR" })
        });

        if (!res.ok) {
          // Replaced alert with console.error and a state for user feedback
          console.error("Failed to fetch assessments");
          // Optionally, set an error state here to display a message to the user
          return;
        }

        const data = await res.json();
        console.log("Fetched assessment data:", data);

        if (Array.isArray(data.team)) {
          // Filter out assessments that are already approved or rejected to only show pending ones
          const pendingAssessments = data.team.filter((assess: TeamAssessment) => assess.hr_approval === 0);
          setTeamAssessments(pendingAssessments);
          // Initialize comments for existing assessments if needed, or leave blank for new input
          const initialComments: { [key: number]: string } = {};
          pendingAssessments.forEach((assess: TeamAssessment) => {
            initialComments[assess.assessment_id] = assess.hr_comments || "";
          });
          setComments(initialComments);
        } else {
          console.warn("Expected 'team' to be an array but got:", data.team);
          setTeamAssessments([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        // Optionally, set an error state here to display a message to the user
      }
    };

    fetchAssessments();
  }, []); // Empty dependency array means this runs once on mount

  const handleApprove = async (assessment_id: number, hrApproval: number) => {
    const hrComment = comments[assessment_id] || ""; // Ensure comment is a string

    try {
      const res = await fetch(`http://localhost:3001/api/eval/hrApproval/${assessment_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approval: hrApproval,
          comments: hrComment,
        })
      });

      if (res.ok) {
        // Filter out the approved/rejected assessment from the list immediately
        setTeamAssessments(prev => prev.filter(a => a.assessment_id !== assessment_id));
        // Provide user feedback without using alert()
        console.log(`Assessment ${assessment_id} ${hrApproval === 1 ? 'approved' : 'rejected'} successfully!`);
        // You might want to add a toast notification here instead of alert
      } else {
        console.error("Approval failed with status:", res.status, await res.text());
        // Provide user feedback without using alert()
      }
    } catch (err) {
      console.error("Approval error:", err);
      // Provide user feedback without using alert()
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-violet-800 border-b-2 pb-3 border-violet-300">HR Approvals</h2>

      {teamAssessments.length === 0 ? (
        <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-md">
          <p className="text-xl font-medium">No pending assessments for approval.</p>
          <p className="mt-2 text-sm">Check back later or ensure all lead assessments are submitted.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamAssessments.map(assess => (
            <div key={assess.assessment_id} className="bg-white p-6 shadow-xl rounded-xl border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-violet-700 mb-2 border-b pb-2 border-violet-200">
                  {assess.employee.employee_name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Assessment for Q{assess.quarter}, {assess.year}
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold text-violet-600 mb-2">Lead Ratings:</h4>
                  <div className="bg-violet-50 p-3 rounded-md max-h-40 overflow-y-auto">
                    {assess.skill_matrix.length > 0 ? (
                      assess.skill_matrix.map((matrix) => (
                        <div
                          key={matrix.skill_matrix_id}
                          className="flex justify-between items-center px-2 py-1 border-b border-violet-100 last:border-b-0"
                        >
                          <span className="text-gray-800">{matrix.skill.skill_name}</span>
                          <span className="font-bold text-violet-800">{matrix.lead_rating}/5</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-sm">No skill ratings provided by lead.</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor={`hr-comments-${assess.assessment_id}`} className="block font-semibold mb-1 text-gray-700">
                    HR Comments:
                  </label>
                  <textarea
                    id={`hr-comments-${assess.assessment_id}`}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200 resize-y"
                    rows={3}
                    placeholder="Add your comments here..."
                    value={comments[assess.assessment_id] || ""}
                    onChange={(e) =>
                      setComments((prev) => ({
                        ...prev,
                        [assess.assessment_id]: e.target.value
                      }))
                    }
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-auto"> {/* mt-auto pushes buttons to the bottom */}
                <button
                  onClick={() => handleApprove(assess.assessment_id, 1)}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg w-full font-semibold shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 active:bg-green-800"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApprove(assess.assessment_id, 2)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg w-full font-semibold shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 active:bg-red-800"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HrApprovals;