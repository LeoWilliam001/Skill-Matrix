import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SkillGapChartProps {
  skillName: string;
  targetValue: number; 
  leadRating: number;  
}

const SkillGapChart: React.FC<SkillGapChartProps> = ({
  skillName,
  targetValue,
  leadRating,
}) => {
  const achieved = Math.min(leadRating, targetValue);
  const gap = Math.max(0, targetValue - leadRating);
  const remaining = Math.max(0, 5 - targetValue);

  const data = {
    labels: ["Achieved", "Gap", "Remaining"],
    datasets: [
      {
        data: [achieved, gap, remaining],
        backgroundColor: ["#34d399", "#f87171", "#e5e7eb"], 
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    rotation: -90,
    circumference: 180,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="w-64 text-center p-4">
      <h2 className="mb-2 font-semibold">{skillName}</h2>
      <Doughnut data={data} options={options} />
      <p className="text-sm mt-1">Lead: {leadRating} / Target: {targetValue}</p>
    </div>
  );
};

export default SkillGapChart;
