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
 * Converts Decimal / string values coming from the DynamoDB-backed Lambda
 * into proper JavaScript numbers.
 */
function normalizeBudget(raw) {
  if (!raw) return null;
  const monthlyLimit = Number(raw.monthlyLimit ?? raw.monthlyBudget ?? 0);
  const spent = Number(raw.spent ?? 0);
  const remaining = monthlyLimit - spent;
  const utilizationPercent =
    monthlyLimit > 0 ? Math.round((spent / monthlyLimit) * 100) : 0;

  return {
    ...raw,
    monthlyLimit,
    spent,
    remaining,
    utilizationPercent,
    categoryBudgets: raw.categoryBudgets ?? [],
  };
}

export const budgetService = {
  /**
   * Fetch the current user's budget from the API.
   */
  async getBudget() {
    const headers = await authHeader();
    try {
      const { data } = await api.get("/budget", { headers });
      return normalizeBudget(data);
    } catch (err) {
      // If no budget exists yet, return sensible defaults
      if (err.response?.status === 404) {
        return {
          monthlyLimit: 0,
          spent: 0,
          remaining: 0,
          utilizationPercent: 0,
          categoryBudgets: [],
        };
      }
      throw err;
    }
  },

  /**
   * Create / update the budget (maps to POST /budget).
   * Both `setBudget` and `updateBudget` call the same endpoint so the
   * UI can use either name interchangeably.
   */
  async setBudget(amount) {
    const headers = await authHeader();
    const { data } = await api.post(
      "/budget",
      { monthlyBudget: Number(amount) },
      { headers }
    );
    return normalizeBudget(data);
  },

  async updateBudget(amount) {
    // The backend only has POST /budget to set the value.
    return this.setBudget(amount);
  },
};
