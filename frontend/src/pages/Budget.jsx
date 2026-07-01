import { useState, useEffect } from 'react';
import { Wallet, AlertTriangle, TrendingUp, Edit2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { budgetService } from '../services/budgetService';
import { formatCurrency } from '../utils/formatters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

const Budget = () => {
  const { success, warning: warnToast, error: errorToast } = useToast();
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [newLimit, setNewLimit] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadBudget = async () => {
      setLoading(true);
      try {
        const data = await budgetService.getBudget();
        setBudget(data);
      } finally {
        setLoading(false);
      }
    };
    loadBudget();
  }, []);

  const handleSave = async () => {
    const amount = parseFloat(newLimit);
    if (!amount || amount <= 0) {
      errorToast('Please enter a valid amount');
      return;
    }

    setSaving(true);
    try {
      const result = await budgetService.updateBudget(amount);
      setBudget(result);
      setShowEdit(false);
      success('Budget updated successfully!');

      if (result.utilizationPercent >= 100) {
        warnToast('⚠️ Warning: You have exceeded your budget!');
      } else if (result.utilizationPercent >= 80) {
        warnToast('⚠️ You are nearing your budget limit');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner.Page />;
  if (!budget) return null;

  const percent = budget.utilizationPercent;
  const isWarning = percent >= 80 && percent < 100;
  const isCritical = percent >= 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Budget</h1>
          <p className="text-sm text-text-muted mt-1">Manage your monthly spending budget</p>
        </div>
        <Button
          icon={Edit2}
          onClick={() => {
            setNewLimit(String(budget.monthlyLimit));
            setShowEdit(true);
          }}
        >
          Edit Budget
        </Button>
      </div>

      {/* Warning Banners */}
      {isCritical && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 flex items-center gap-3 animate-slide-up">
          <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-danger">Budget Exceeded!</p>
            <p className="text-xs text-danger/80">
              You've spent {formatCurrency(budget.spent)} of your {formatCurrency(budget.monthlyLimit)} budget.
              Consider adjusting your spending.
            </p>
          </div>
        </div>
      )}
      {isWarning && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center gap-3 animate-slide-up">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-warning">Approaching Budget Limit</p>
            <p className="text-xs text-warning/80">
              You've used {percent}% of your monthly budget. Be mindful of your spending.
            </p>
          </div>
        </div>
      )}

      {/* Budget Overview */}
      <Card className="text-center">
        <div className="py-6">
          <p className="text-6xl font-extrabold text-text-primary mb-2">{percent}%</p>
          <p className="text-text-muted mb-8">of your monthly budget used</p>
          <div className="max-w-md mx-auto">
            <ProgressBar value={budget.spent} max={budget.monthlyLimit} size="lg" showLabel={false} />
          </div>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div>
              <p className="text-2xl font-bold text-text-primary">{formatCurrency(budget.monthlyLimit)}</p>
              <p className="text-xs text-text-muted mt-1">Monthly Budget</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{formatCurrency(budget.spent)}</p>
              <p className="text-xs text-text-muted mt-1">Total Spent</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${budget.remaining >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(Math.abs(budget.remaining))}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {budget.remaining >= 0 ? 'Remaining' : 'Over Budget'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Budgets */}
      <Card>
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Budget by Category
            </span>
          </Card.Title>
        </Card.Header>
        <div className="space-y-5">
          {budget.categoryBudgets.map((cat) => {
            const catPercent = Math.round((cat.spent / cat.limit) * 100);
            const catOver = catPercent >= 100;
            const catWarn = catPercent >= 80 && catPercent < 100;

            return (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium text-text-primary">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-text-muted">{formatCurrency(cat.spent)} / {formatCurrency(cat.limit)}</span>
                    <span className={`font-semibold ${catOver ? 'text-danger' : catWarn ? 'text-warning' : 'text-text-secondary'}`}>
                      {catPercent}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-bg rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(catPercent, 100)}%`,
                      backgroundColor: catOver ? '#EF4444' : catWarn ? '#F59E0B' : cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Monthly Budget"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save Budget</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Monthly Budget Amount ($)"
            type="number"
            placeholder="2500"
            min="0"
            step="100"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
          />
          <div className="p-3 rounded-lg bg-bg text-xs text-text-muted">
            <p>Current spending: <span className="text-text-primary font-medium">{formatCurrency(budget.spent)}</span></p>
            {newLimit && parseFloat(newLimit) > 0 && (
              <p className="mt-1">
                Utilization: <span className={`font-medium ${
                  (budget.spent / parseFloat(newLimit)) * 100 >= 100 ? 'text-danger' : 'text-primary'
                }`}>
                  {Math.round((budget.spent / parseFloat(newLimit)) * 100)}%
                </span>
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Budget;
