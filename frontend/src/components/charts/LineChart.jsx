import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ labels, data, label = 'Spending', height = 300 }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#1E293B',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#F1F5F9',
        bodyColor: '#94A3B8',
        borderColor: '#334155',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)', drawBorder: false },
        ticks: { color: '#64748B', font: { size: 12 } },
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)', drawBorder: false },
        ticks: {
          color: '#64748B',
          font: { size: 12 },
          callback: (val) => `$${val.toLocaleString()}`,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
