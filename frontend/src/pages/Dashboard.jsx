import { useState, useEffect } from 'react';
import {
  DollarSign,
  Calendar,
  Wallet,
  ArrowUpDown,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { expenseService } from '../services/expenseService';
import { budgetService } from '../services/budgetService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CATEGORIES } from '../data/categories';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import LineChart from '../components/charts/LineChart';
import DoughnutChart from '../components/charts/DoughnutChart';
import { monthlySpending, categoryDistribution } from '../data/analytics';
import { getCategoryColor } from '../data/categories';

const Dashboard = () => {
  const { user } = useAuth();
  const { success } = useToast();
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [todaySpending, setTodaySpending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickForm, setQuickForm] = useState({ title: '', category: 'food', amount: '', date: new Date().toISOString().split('T')[0], notes: '' });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [recent, budgetData, today] = await Promise.all([
          expenseService.getRecentExpenses(5),
          budgetService.getBudget(),
          expenseService.getTodaySpending(),
        ]);
        setRecentExpenses(recent);
        setBudget(budgetData);
        setTodaySpending(today);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickForm.title || !quickForm.amount) return;
    await expenseService.createExpense({ ...quickForm, amount: parseFloat(quickForm.amount) });
    const recent = await expenseService.getRecentExpenses(5);
    setRecentExpenses(recent);
    setShowQuickAdd(false);
    setQuickForm({ title: '', category: 'food', amount: '', date: new Date().toISOString().split('T')[0], notes: '' });
    success('Expense added successfully!');
  };

  if (loading) return <Spinner.Page />;

  const monthlySpent = budget?.spent || 1950;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-text-muted mt-1">Here's your financial overview</p>
        </div>
        <Button icon={Plus} onClick={() => setShowQuickAdd(true)}>
          Quick Add
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Spending"
          value={formatCurrency(todaySpending || 127.50)}
          icon={DollarSign}
          iconColor="#3B82F6"
          trend={-12}
          trendLabel="vs yesterday"
        />
        <StatCard
          title="Monthly Spending"
          value={formatCurrency(monthlySpent)}
          icon={Calendar}
          iconColor="#A855F7"
          trend={8.2}
          trendLabel="vs last month"
        />
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(budget?.remaining || 550)}
          icon={Wallet}
          iconColor="#22C55E"
          trendLabel={`of ${formatCurrency(budget?.monthlyLimit || 2500)}`}
        />
        <StatCard
          title="Total Transactions"
          value="25"
          icon={ArrowUpDown}
          iconColor="#F59E0B"
          trend={5}
          trendLabel="this month"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Spending Trend */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>Spending Trend</Card.Title>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <TrendingUp className="w-3.5 h-3.5" />
              Last 7 months
            </div>
          </Card.Header>
          <LineChart
            labels={monthlySpending.map((m) => m.month)}
            data={monthlySpending.map((m) => m.amount)}
            height={250}
          />
        </Card>

        {/* Category Breakdown */}
        <Card>
          <Card.Header>
            <Card.Title>Category Breakdown</Card.Title>
          </Card.Header>
          <DoughnutChart
            labels={categoryDistribution.map((c) => c.category)}
            data={categoryDistribution.map((c) => c.amount)}
            height={250}
          />
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Expenses */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>Recent Expenses</Card.Title>
            <a href="/expenses" className="text-xs text-primary hover:text-primary-hover transition-colors">
              View all →
            </a>
          </Card.Header>
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-surface-hover/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${getCategoryColor(expense.category)}15` }}
                  >
                    <DollarSign className="w-4 h-4" style={{ color: getCategoryColor(expense.category) }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{expense.title}</p>
                    <p className="text-xs text-text-muted">{formatDate(expense.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary">-{formatCurrency(expense.amount)}</p>
                  <Badge color={getCategoryColor(expense.category)}>
                    {expense.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Budget Progress */}
        <Card>
          <Card.Header>
            <Card.Title>Budget Progress</Card.Title>
          </Card.Header>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-text-primary mb-1">
                {budget?.utilizationPercent || 78}%
              </p>
              <p className="text-sm text-text-muted">Budget Used</p>
            </div>
            <ProgressBar
              value={budget?.spent || 1950}
              max={budget?.monthlyLimit || 2500}
              size="lg"
            />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 rounded-lg bg-bg">
                <p className="text-lg font-bold text-text-primary">{formatCurrency(budget?.spent || 1950)}</p>
                <p className="text-xs text-text-muted">Spent</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-bg">
                <p className="text-lg font-bold text-success">{formatCurrency(budget?.remaining || 550)}</p>
                <p className="text-xs text-text-muted">Remaining</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Add Modal */}
      <Modal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        title="Quick Add Expense"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowQuickAdd(false)}>Cancel</Button>
            <Button onClick={handleQuickAdd}>Add Expense</Button>
          </>
        }
      >
        <form onSubmit={handleQuickAdd} className="space-y-4">
          <Input
            label="Title"
            placeholder="What did you spend on?"
            value={quickForm.title}
            onChange={(e) => setQuickForm({ ...quickForm, title: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount"
              type="number"
              placeholder="0.00"
              value={quickForm.amount}
              onChange={(e) => setQuickForm({ ...quickForm, amount: e.target.value })}
            />
            <Select
              label="Category"
              value={quickForm.category}
              onChange={(e) => setQuickForm({ ...quickForm, category: e.target.value })}
              options={CATEGORIES.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
          <Input
            label="Date"
            type="date"
            value={quickForm.date}
            onChange={(e) => setQuickForm({ ...quickForm, date: e.target.value })}
          />
          <Input
            label="Notes (optional)"
            placeholder="Add a note..."
            value={quickForm.notes}
            onChange={(e) => setQuickForm({ ...quickForm, notes: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
