import { mockExpenses, generateId } from '../data/expenses';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

let expenses = [...mockExpenses];

export const expenseService = {
  async getExpenses({ search = '', category = '', sortBy = 'date', sortOrder = 'desc', page = 1, perPage = 8 } = {}) {
    await delay();

    let filtered = [...expenses];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.notes.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    if (category) {
      filtered = filtered.filter((e) => e.category === category);
    }

    filtered.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'amount') {
        valA = a.amount;
        valB = b.amount;
      } else {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const data = filtered.slice(start, start + perPage);

    return { data, total, totalPages, currentPage: page };
  },

  async getExpenseById(id) {
    await delay(200);
    const expense = expenses.find((e) => e.id === id);
    if (!expense) throw new Error('Expense not found');
    return { ...expense };
  },

  async createExpense(data) {
    await delay(400);
    const newExpense = { ...data, id: generateId() };
    expenses = [newExpense, ...expenses];
    return newExpense;
  },

  async updateExpense(id, data) {
    await delay(400);
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    expenses[index] = { ...expenses[index], ...data };
    return { ...expenses[index] };
  },

  async deleteExpense(id) {
    await delay(300);
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    expenses = expenses.filter((e) => e.id !== id);
    return { success: true };
  },

  async getRecentExpenses(limit = 5) {
    await delay(200);
    const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted.slice(0, limit);
  },

  async getTodaySpending() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const todayExpenses = expenses.filter((e) => e.date === today);
    return todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  },
};
