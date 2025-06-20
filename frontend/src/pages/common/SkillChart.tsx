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

interface SkillBarChartProps {
  skillMatrix: {
    skill: { skill_name: string };
    employee_rating: number;
    lead_rating: number;
  }[];
}

const SkillBarChart: React.FC<SkillBarChartProps> = ({ skillMatrix }) => {
  const labels = skillMatrix.map((item) => item.skill.skill_name);

  const data = {
    labels,
    datasets: [
      {
        label: "Employee 👤",
        data: skillMatrix.map((item) => item.employee_rating),
        backgroundColor: "#60a5fa",
      },
      {
        label: "Lead 🧑‍💼",
        data: skillMatrix.map((item) => item.lead_rating),
        backgroundColor: "#34d399",
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-lg font-semibold text-center mb-4">Skill Comparison Chart</h2>
      <Bar
        data={data}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: { stepSize: 1 },
              title: { display: true, text: "Rating" },
            },
          },
        }}
      />
    </div>
  );
};

export default SkillBarChart;
