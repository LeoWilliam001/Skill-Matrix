// src/components/TeamSkillChart.tsx
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Skill {
  skill_id: number;
  skill_name: string;
  pos_id: number;
  position: { position_id: number; position_name: string };
}

interface SkillMatrixEntry {
  skill_matrix_id: number;
  skill_id: number;
  employee_rating: number;
  lead_rating: number;
  skill: Skill;
}

interface Employee {
  employee_id: number;
  employee_name: string;
  designation: { d_id: number; desig_name: string };
}

interface Assessment {
  assessment_id: number;
  employee_id: number;
  employee: Employee;
  skill_matrix: SkillMatrixEntry[];
}

interface TeamSkillChartProps {
  filteredAssessments: Assessment[];
  filteredSkills: Skill[];
}

const TeamSkillChart: React.FC<TeamSkillChartProps> = ({ filteredAssessments, filteredSkills }) => {
  const labels = filteredSkills.map(s => s.skill_name);

  const datasets = filteredAssessments.map(empAssessment => {
    const employeeName = empAssessment.employee.employee_name;
    const ratingsForEmployee = filteredSkills.map(skill => {
      const skillEntry = empAssessment.skill_matrix.find(sm => sm.skill.skill_id === skill.skill_id);
      return skillEntry ? skillEntry.lead_rating : 0;
    });

    const randomColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)`;

    return {
      label: employeeName,
      data: ratingsForEmployee,
      backgroundColor: randomColor,
      borderColor: randomColor.replace('0.8', '1'),
      borderWidth: 1,
    };
  });

  const data = {
    labels,
    datasets,
  };

  return (
    <div className="w-full mx-auto mt-8 h-[400px]"> 
      <h2 className="text-xl font-semibold text-center mb-4">Team Skill Comparison Chart</h2>
      {datasets.length > 0 && labels.length > 0 ? (
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: false,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Skills',
                },
              },
              y: {
                beginAtZero: true,
                max: 5,
                ticks: { stepSize: 1 },
                title: {
                  display: true,
                  text: 'Lead Rating',
                },
              },
            },
          }}
        />
      ) : (
        <p className="text-gray-600 text-center py-4">Select employees/skills to view chart data.</p>
      )}
    </div>
  );
};

export default TeamSkillChart;