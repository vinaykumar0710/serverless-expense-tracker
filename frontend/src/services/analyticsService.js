import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/**
 * Builds the Authorization header from the current Cognito session.
 */
async function authHeader() {
  const session = await fetchAuthSession();
  return {
    Authorization: `Bearer ${session.tokens.accessToken.toString()}`,
  };
}

/**
 * Coerce any value to a JS number (handles Decimal strings from DynamoDB).
 */
const num = (v) => Number(v ?? 0);

export const analyticsService = {
  /**
   * Fetch analytics data from the backend.
   * Falls back to returning the relevant slice of the response when certain
   * keys are missing, so the UI never crashes.
   */
  async _fetchAnalytics() {
    const headers = await authHeader();
    const { data } = await api.get("/analytics", { headers });
    return data;
  },

  async getMonthlySpending() {
    const data = await this._fetchAnalytics();
    return (data.monthlySpending ?? []).map((m) => ({
      month: m.month,
      amount: num(m.amount),
    }));
  },

  async getWeeklySpending() {
    const data = await this._fetchAnalytics();
    return (data.weeklySpending ?? []).map((d) => ({
      day: d.day,
      amount: num(d.amount),
    }));
  },

  async getYearlySpending() {
    const data = await this._fetchAnalytics();
    return (data.yearlySpending ?? []).map((d) => ({
      year: String(d.year),
      amount: num(d.amount),
    }));
  },

  async getCategoryDistribution() {
    const data = await this._fetchAnalytics();
    return (data.categoryDistribution ?? []).map((c) => ({
      category: c.category,
      amount: num(c.amount),
      percentage: num(c.percentage),
    }));
  },

  async getSummary() {
    const data = await this._fetchAnalytics();
    const summary = data.summary ?? data;
    return {
      totalSpent: num(summary.totalSpent),
      averageDaily: num(summary.averageDaily),
      highestExpense: summary.highestExpense
        ? {
            title: summary.highestExpense.title,
            amount: num(summary.highestExpense.amount),
            date: summary.highestExpense.date,
          }
        : { title: "—", amount: 0, date: "" },
      totalTransactions: num(summary.totalTransactions),
      currentMonthSpent: num(summary.currentMonthSpent),
      previousMonthSpent: num(summary.previousMonthSpent),
      monthlyChange: num(summary.monthlyChange),
    };
  },
};
