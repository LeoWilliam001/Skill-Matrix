import { useEffect, useState } from 'react';
interface Skills{
    skill_id: number;
    skill_name: string;
    pos_id: number;
}
interface Criteria{
    level_id:number;
    level_number: number;
    description: string;
    skill:Skills;
}

const SkillCriteria = () => {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [skills, setSkills] = useState<Skills[]>([]);
  const levelLabels: { [key: number]: string } = {
    1: "Low",
    2: "Moderate",
    3: "Average",
    4: "Trainer",
    5: "Senior",
  };
  
  const handleSkillClick=async(id:number)=>{
    const res = await fetch(`http://localhost:3001/api/skill/getCriteria/${id}`); 
    const data = await res.json();
    setCriteria(data);
  }
  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const skill=await fetch('http://localhost:3001/api/skill/getAllSkills');
        const skill_data=await skill.json();
        setSkills(skill_data);

        const res = await fetch(`http://localhost:3001/api/skill/getCriteria/${skill_data[0].skill_id}`); 
        const data = await res.json();
        setCriteria(data);
      } catch (error) {
        console.error('Error fetching skill criteria:', error);
      }
    };

    fetchCriteria();
  }, []);

  return (
    <div className='m-2'>
      <div className="text-lg font-bold mb-2">Skill Criteria</div>
      <div className="flex gap-3">
        <div className="mt-3 border-2 p-1 w-[300px] h-[450px] rounded-xl bg-violet-200 overflow-y-auto flex-shrink-0">
          {skills.map((skill) => (
            <div key={skill.skill_id} className="flex justify-center">
              <button
                className="w-full mt-3 bg-violet-500 text-white py-2 px-4 rounded-3xl hover:bg-violet-700 transition-all cursor-pointer"
                onClick={() => handleSkillClick(skill.skill_id)}
              >
                {skill.skill_name}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 border-2 p-3 w-[930px] h-[450px] rounded-lg bg-violet-200 overflow-y-auto flex-shrink">
          {criteria.map((item) => (
            <div
              key={item.level_id}
              className="mb-4 border p-2 rounded-xl bg-violet-100"
            >
              <div className="font-semibold">{levelLabels[item.level_number]} Level ({item.skill.skill_name})</div>
              <div className="text-sm text-gray-700">{item.description}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SkillCriteria;


