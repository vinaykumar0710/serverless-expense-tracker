import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ labels, data, colors, height = 300 }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors || [
          '#F97316', '#3B82F6', '#A855F7', '#EF4444',
          '#EC4899', '#22C55E', '#06B6D4', '#64748B',
        ],
        borderColor: '#1E293B',
        borderWidth: 3,
        hoverBorderColor: '#334155',
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94A3B8',
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#F1F5F9',
        bodyColor: '#94A3B8',
        borderColor: '#334155',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const percent = ((ctx.parsed / total) * 100).toFixed(1);
            return `$${ctx.parsed.toLocaleString()} (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
