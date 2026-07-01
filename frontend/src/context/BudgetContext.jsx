import { createContext, useContext, useState, useCallback } from 'react';
import { budgetService } from '../services/budgetService';

const BudgetContext = createContext(null);

export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBudget = useCallback(async () => {
    setLoading(true);
    try {
      const result = await budgetService.getBudget();
      setBudget(result);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBudgetLimit = useCallback(async (amount) => {
    setLoading(true);
    try {
      const result = await budgetService.updateBudget(amount);
      setBudget(result);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatus = useCallback(() => {
    if (!budget) return 'normal';
    if (budget.utilizationPercent >= 100) return 'critical';
    if (budget.utilizationPercent >= 80) return 'warning';
    return 'normal';
  }, [budget]);

  return (
    <BudgetContext.Provider
      value={{ budget, loading, fetchBudget, updateBudgetLimit, getStatus }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within a BudgetProvider');
  return context;
};
