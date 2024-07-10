import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FC } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataItem {
  category: string;
  cost: number;
}

interface CostChartProps {
  data: ChartDataItem[];
}

const defaultData: ChartDataItem[] = [{ category: "No Data", cost: 0 }];

const CostChart: FC<CostChartProps> = ({ data }) => {
  const chartData = {
    labels: (data.length ? data : defaultData).map((item) => item.category),
    datasets: [
      {
        label: "Cost in PHP",
        data: (data.length ? data : defaultData).map((item) => item.cost),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Project Cost Estimation",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default CostChart;
