import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ labels, data, colors, label = 'Amount', height = 300, horizontal = false }) => {
  const defaultColors = labels.map((_, i) => {
    const palette = ['#F97316', '#3B82F6', '#A855F7', '#EF4444', '#EC4899', '#22C55E', '#06B6D4', '#64748B'];
    return palette[i % palette.length];
  });

  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: (colors || defaultColors).map((c) => `${c}CC`),
        borderColor: colors || defaultColors,
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
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
          label: (ctx) => `$${ctx.parsed[horizontal ? 'x' : 'y'].toLocaleString()}`,
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
          callback: (val) => (horizontal ? val : `$${val.toLocaleString()}`),
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
