import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useEffect, useState } from "react";
// import SkillGapChart from "./SkillGapChart";

interface SkillMatrixEntry {
  skill_id: number;
  lead_rating: number;
}

interface TargetEntry {
  skill_skill_id: number;
  skill_skill_name: string;
  tv_threshold_value: number;
}

const Dash: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [matrix, setMatrix] = useState<SkillMatrixEntry[]>([]);
  const [targets, setTargets] = useState<TargetEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await fetch(
        `http://localhost:3001/api/skill/getRecentMatrix/${user?.employee_id}`
      );
      const matrixData = await res1.json();
      setMatrix(matrixData);

      const res2 = await fetch(
        `http://localhost:3001/api/skill/getDesigTarget/${user?.employee_id}`
      );
      const targetData = await res2.json();
      setTargets(targetData);
    };

    if (user?.employee_id && user?.desig_id) {
      fetchData();
    }
  }, [user]);

  const mergedData = targets.map((target) => {
    const matched = matrix.find((m) => m.skill_id === target.skill_skill_id);
    return {
      skillName: target.skill_skill_name,
      targetValue: target.tv_threshold_value,
      currentValue: matched?.lead_rating ?? 0,
    };
  });

  return (
    <>
      <div className="text-2xl text-violet-500 mb-4">
        Welcome {user?.employee_name}
      </div>

      <div className="flex flex-wrap gap-4">
        {/* {mergedData.map((entry) => (
          <SkillGapChart
          key={entry.skillName}
          skillName={entry.skillName}
          targetValue={entry.targetValue}
          leadRating={entry.currentValue}
        />
        
        ))} */}
      </div>
      <div className='flex flex-col lg:flex-row gap-6'>
            <div className='w-full lg:w-1/3 bg-violet-200 p-5 rounded-xl shadow-md'>
                <p className='text-2xl font-bold text-violet-800 mb-4 border-b pb-2 border-violet-300'>Profile</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <p><span className="font-semibold text-gray-600 text-sm">Age:</span> <div className='text-lg text-gray-800'>{user?.age}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Gender:</span> <div className='text-lg text-gray-800'>{user?.gender}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Position:</span> <div className='text-lg text-gray-800'>{user?.emp_pos.find(pos => pos.is_primary == true)?.position.position_name}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Role:</span> <div className='text-lg text-gray-800'>{user?.role.role_name}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Email:</span> <div className='text-lg text-gray-800'>{user?.email}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Living City:</span> <div className='text-lg text-gray-800'>{user?.location}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Nationality:</span> <div className='text-lg text-gray-800'>{user?.nationality}</div></p>
                    <p><span className="font-semibold text-gray-600 text-sm">Marital Status:</span> <div className='text-lg text-gray-800'>{user?.marital_status}</div></p>
                </div>
            </div>

            <div className='w-full lg:w-1/3 bg-violet-200 p-5 rounded-xl shadow-md'>
          <p className='text-2xl font-bold text-violet-800 mb-4 border-b pb-2 border-violet-300'>Skills</p>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-y-3">
            <div>
              <span className="font-semibold text-gray-600 text-sm">My Skills:</span>
              <div className="mt-2 space-y-2">
                {user?.emp_pos.map((pos) =>
                  pos.position?.skills.map((s) => {
                    const matchedRating = matrix.find((m) => m.skill_id === s.skill_id);
                    const targetRating = targets.find((t) => t.skill_skill_id === s.skill_id)?.tv_threshold_value;

                    return (
                      <div
                        key={s.skill_id}
                        className="flex flex-col sm:flex-row justify-between bg-violet-500 p-3 rounded-md shadow-sm"
                      >
                        <span className="text-white font-medium">{s.skill_name}</span>
                        <span className="text-white text-sm">
                          Current: {matchedRating?.lead_rating ?? "N/A"} | Target: {targetRating ?? "N/A"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dash;
