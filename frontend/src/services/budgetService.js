import { mockBudget } from '../data/budgets';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

let budget = { ...mockBudget };

export const budgetService = {
  async getBudget() {
    await delay();
    return { ...budget };
  },

  async setBudget(amount) {
    await delay(400);
    budget = {
      ...budget,
      monthlyLimit: amount,
      remaining: amount - budget.spent,
      utilizationPercent: Math.round((budget.spent / amount) * 100),
    };
    return { ...budget };
  },

  async updateBudget(amount) {
    await delay(400);
    budget = {
      ...budget,
      monthlyLimit: amount,
      remaining: amount - budget.spent,
      utilizationPercent: Math.round((budget.spent / amount) * 100),
    };
    return { ...budget };
  },
};
