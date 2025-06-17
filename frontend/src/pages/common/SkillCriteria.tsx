import { useEffect, useState } from 'react';

interface Skills {
  skill_id: number;
  skill_name: string;
  pos_id: number;
  is_active: number;
  created_at: string;
}

interface Criteria {
  level_id: number;
  level_number: number;
  description: string;
  skill: Skills;
}

interface Position {
  position_id: number;
  position_name: string;
  skills: Skills[]; 
}

const SkillCriteria = () => {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [activePositionId, setActivePositionId] = useState<number | null>(null); 
  const [activeSkillId, setActiveSkillId] = useState<number | null>(null); 
  const [skillsForActivePosition, setSkillsForActivePosition] = useState<Skills[]>([]); 

  const levelLabels: { [key: number]: string } = {
    1: "Low",
    2: "Moderate",
    3: "Average",
    4: "Trainer",
    5: "Senior",
  };

  const handlePositionClick = (position: Position) => {
    setActivePositionId(prevId => (prevId === position.position_id ? null : position.position_id));

    if (activePositionId !== position.position_id) {
      setSkillsForActivePosition(position.skills);
      setCriteria([]); 
      setActiveSkillId(null); 
      
      if (position.skills.length > 0) {
        handleSkillClick(position.skills[0].skill_id);
      }
    } else {
      setSkillsForActivePosition([]);
      setCriteria([]);
      setActiveSkillId(null);
    }
  };

  const handleSkillClick = async (skillId: number) => {
    setActiveSkillId(skillId); 
    try {
      const res = await fetch(`http://localhost:3001/api/skill/getCriteria/${skillId}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch criteria for skill ${skillId}: ${res.status} ${errorText}`);
      }
      const data: Criteria[] = await res.json();
      setCriteria(data);
    } catch (error) {
      console.error('Error fetching skill criteria:', error);
      setCriteria([]); 
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const positionsRes = await fetch('http://localhost:3001/api/skill/getPositions');
        if (!positionsRes.ok) {
          const errorText = await positionsRes.text();
          throw new Error(`Failed to fetch positions: ${positionsRes.status} ${errorText}`);
        }
        const positionsData: Position[] = await positionsRes.json();
        setPositions(positionsData);

        if (positionsData.length > 0) {
          const firstPosition = positionsData[0];
          setActivePositionId(firstPosition.position_id);
          setSkillsForActivePosition(firstPosition.skills);

          if (firstPosition.skills.length > 0) {
            handleSkillClick(firstPosition.skills[0].skill_id); 
          }
        }
      } catch (error) {
        console.error('Error during initial data fetch:', error);
        setPositions([]);
        setSkillsForActivePosition([]);
        setCriteria([]);
      }
    };

    fetchInitialData();
  }, []); 

  return (
    <div className='p-4'>
      <h2 className="text-2xl font-bold text-violet-800 mb-4 border-b pb-2 border-violet-300">Skill Criteria</h2>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/4 bg-violet-200 p-3 rounded-xl shadow-md overflow-y-auto max-h-[500px]">
          {positions.length > 0 ? (
            positions.map((position) => (
              <div key={position.position_id} className="mb-2">
                <button
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-all duration-200 flex justify-between items-center
                    ${activePositionId === position.position_id ? 'bg-violet-700 shadow-md' : 'bg-violet-500 hover:bg-violet-600'}
                    focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75`}
                  onClick={() => handlePositionClick(position)} 
                >
                  {position.position_name}
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      activePositionId === position.position_id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {activePositionId === position.position_id && skillsForActivePosition.length > 0 && (
                  <div className="mt-2 pl-4 border-l border-violet-400">
                    {skillsForActivePosition.map((skill) => (
                      <button
                        key={skill.skill_id}
                        className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 mb-1
                          ${activeSkillId === skill.skill_id ? 'bg-violet-400 text-white font-semibold' : 'text-gray-700 hover:bg-violet-300'}
                          focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-75`}
                        onClick={() => handleSkillClick(skill.skill_id)}
                      >
                        {skill.skill_name}
                      </button>
                    ))}
                  </div>
                )}
                {activePositionId === position.position_id && skillsForActivePosition.length === 0 && (
                  <p className="text-gray-600 text-sm mt-2 text-center">No skills for this position.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-5">No positions available.</p>
          )}
        </div>

        <div className="w-full lg:w-3/4 bg-violet-200 p-5 rounded-xl shadow-md overflow-y-auto max-h-[500px]">
          {criteria.length > 0 ? (
            criteria.map((item) => (
              <div
                key={item.level_id}
                className="mb-4 p-4 rounded-xl bg-violet-100 shadow-sm border border-violet-200"
              >
                <div className="font-semibold text-violet-700 text-lg mb-1">
                  {levelLabels[item.level_number]} Level ({item.skill.skill_name})
                </div>
                <div className="text-sm text-gray-800">{item.description}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-10">
              {activeSkillId === null ? 'Select a skill to view its criteria.' : 'No criteria found for this skill.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillCriteria;