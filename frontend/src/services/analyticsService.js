import {
  monthlySpending,
  weeklySpending,
  yearlySpending,
  categoryDistribution,
  analyticsSummary,
} from '../data/analytics';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyticsService = {
  async getMonthlySpending() {
    await delay();
    return [...monthlySpending];
  },

  async getWeeklySpending() {
    await delay();
    return [...weeklySpending];
  },

  async getYearlySpending() {
    await delay();
    return [...yearlySpending];
  },

  async getCategoryDistribution() {
    await delay();
    return [...categoryDistribution];
  },

  async getSummary() {
    await delay();
    return { ...analyticsSummary };
  },
};
