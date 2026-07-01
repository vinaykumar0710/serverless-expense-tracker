import { createContext, useContext, useState, useCallback } from 'react';
import { expenseService } from '../services/expenseService';

const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    perPage: 8,
  });

  const fetchExpenses = useCallback(async (overrideFilters) => {
    setLoading(true);
    try {
      const params = overrideFilters || filters;
      const result = await expenseService.getExpenses(params);
      setExpenses(result.data);
      setPagination({
        total: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const addExpense = useCallback(async (data) => {
    const newExpense = await expenseService.createExpense(data);
    await fetchExpenses();
    return newExpense;
  }, [fetchExpenses]);

  const updateExpense = useCallback(async (id, data) => {
    const updated = await expenseService.updateExpense(id, data);
    await fetchExpenses();
    return updated;
  }, [fetchExpenses]);

  const deleteExpense = useCallback(async (id) => {
    await expenseService.deleteExpense(id);
    await fetchExpenses();
  }, [fetchExpenses]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      if (newFilters.search !== undefined || newFilters.category !== undefined) {
        updated.page = 1;
      }
      return updated;
    });
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        pagination,
        filters,
        fetchExpenses,
        addExpense,
        updateExpense,
        deleteExpense,
        updateFilters,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used within an ExpenseProvider');
  return context;
};
