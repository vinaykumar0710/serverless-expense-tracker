import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  ArrowUp,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { formatCurrency } from '../utils/formatters';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Spinner from '../components/ui/Spinner';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import DoughnutChart from '../components/charts/DoughnutChart';

const timeRanges = ['Weekly', 'Monthly', 'Yearly'];

const Analytics = () => {
  const [activeRange, setActiveRange] = useState('Monthly');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [summaryRes, monthly, weekly, yearly, categories] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getMonthlySpending(),
          analyticsService.getWeeklySpending(),
          analyticsService.getYearlySpending(),
          analyticsService.getCategoryDistribution(),
        ]);
        setSummary(summaryRes);
        setMonthlyData(monthly);
        setWeeklyData(weekly);
        setYearlyData(yearly);
        setCategoryData(categories);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Spinner.Page />;

  const getChartData = () => {
    switch (activeRange) {
      case 'Weekly':
        return { labels: weeklyData.map((d) => d.day), data: weeklyData.map((d) => d.amount) };
      case 'Yearly':
        return { labels: yearlyData.map((d) => d.year), data: yearlyData.map((d) => d.amount) };
      default:
        return { labels: monthlyData.map((d) => d.month), data: monthlyData.map((d) => d.amount) };
    }
  };

  const chartData = getChartData();

  const topCategories = [...categoryData].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const categoryColors = ['#F97316', '#3B82F6', '#A855F7', '#EF4444', '#EC4899', '#22C55E', '#06B6D4', '#64748B'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="text-sm text-text-muted mt-1">Analyze your spending patterns and trends</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Spent (2026)"
          value={formatCurrency(summary?.totalSpent || 0)}
          icon={DollarSign}
          iconColor="#3B82F6"
        />
        <StatCard
          title="Average Daily"
          value={formatCurrency(summary?.averageDaily || 0)}
          icon={Calendar}
          iconColor="#A855F7"
        />
        <StatCard
          title="Highest Expense"
          value={formatCurrency(summary?.highestExpense?.amount || 0)}
          icon={ArrowUp}
          iconColor="#EF4444"
          trendLabel={summary?.highestExpense?.title}
        />
        <StatCard
          title="Monthly Change"
          value={`${summary?.monthlyChange > 0 ? '+' : ''}${summary?.monthlyChange}%`}
          icon={TrendingUp}
          iconColor="#22C55E"
          trend={summary?.monthlyChange}
          trendLabel="vs previous month"
        />
      </div>

      {/* Spending Over Time */}
      <Card>
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Spending Over Time
            </span>
          </Card.Title>
          <div className="flex items-center bg-bg rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer
                  ${activeRange === range
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-muted hover:text-text-secondary'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
        </Card.Header>
        <LineChart
          labels={chartData.labels}
          data={chartData.data}
          label={`${activeRange} Spending`}
          height={300}
        />
      </Card>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <Card.Header>
            <Card.Title>Top Spending Categories</Card.Title>
          </Card.Header>
          <BarChart
            labels={topCategories.map((c) => c.category)}
            data={topCategories.map((c) => c.amount)}
            colors={categoryColors.slice(0, topCategories.length)}
            height={280}
          />
        </Card>

        {/* Category Distribution */}
        <Card>
          <Card.Header>
            <Card.Title>Category Distribution</Card.Title>
          </Card.Header>
          <DoughnutChart
            labels={categoryData.map((c) => c.category)}
            data={categoryData.map((c) => c.amount)}
            colors={categoryColors}
            height={280}
          />
        </Card>
      </div>

      {/* Category Breakdown Table */}
      <Card>
        <Card.Header>
          <Card.Title>Category Breakdown</Card.Title>
        </Card.Header>
        <div className="space-y-3">
          {categoryData.map((cat, index) => (
            <div key={cat.category} className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: categoryColors[index] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-text-primary">{cat.category}</span>
                  <span className="text-sm font-semibold text-text-primary">{formatCurrency(cat.amount)}</span>
                </div>
                <div className="w-full bg-bg rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: categoryColors[index],
                    }}
                  />
                </div>
              </div>
              <span className="text-xs text-text-muted w-10 text-right">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
