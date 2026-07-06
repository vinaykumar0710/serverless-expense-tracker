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
 * Converts a single backend expense object into the shape the UI expects.
 * - Renames `expenseId` → `id`
 * - Coerces `amount` (may arrive as a Decimal string) to a JS number
 */
function normalizeExpense(raw) {
  return {
    ...raw,
    id: raw.expenseId ?? raw.id,
    amount: Number(raw.amount),
  };
}

/**
 * Normalizes an array of backend expenses.
 */
function normalizeExpenses(rawList) {
  return (rawList || []).map(normalizeExpense);
}

export const expenseService = {
  /**
   * Fetch all expenses from the API, then apply client-side
   * search, category filter, sorting, and pagination.
   *
   * @param {Object} params
   * @param {string}  params.search    - text to match against title / notes
   * @param {string}  params.category  - category id to filter by ('' = all)
   * @param {string}  params.sortBy    - 'date' | 'amount'
   * @param {string}  params.sortOrder - 'asc' | 'desc'
   * @param {number}  params.page      - 1-based page number
   * @param {number}  params.perPage   - items per page
   * @returns {{ data: Array, total: number, totalPages: number, currentPage: number }}
   */
  async getExpenses(params = {}) {
    const {
      search = "",
      category = "",
      sortBy = "date",
      sortOrder = "desc",
      page = 1,
      perPage = 8,
    } = params;

    const headers = await authHeader();
    const { data } = await api.get("/expenses", { headers });

    let expenses = normalizeExpenses(data.expenses ?? data);

    // --- Client-side search ---
    if (search) {
      const q = search.toLowerCase();
      expenses = expenses.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.notes?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q)
      );
    }

    // --- Client-side category filter ---
    if (category) {
      expenses = expenses.filter((e) => e.category === category);
    }

    // --- Client-side sorting ---
    expenses.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "amount") {
        cmp = a.amount - b.amount;
      } else {
        // Default: sort by date
        cmp = new Date(a.date) - new Date(b.date);
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    // --- Client-side pagination ---
    const total = expenses.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * perPage;
    const paged = expenses.slice(start, start + perPage);

    return { data: paged, total, totalPages, currentPage };
  },

  /**
   * Fetch a single expense by ID.
   * Falls back to fetching all and filtering client-side because the
   * backend does not expose a GET /expenses/:id endpoint.
   */
  async getExpenseById(id) {
    const headers = await authHeader();
    const { data } = await api.get("/expenses", { headers });
    const expenses = normalizeExpenses(data.expenses ?? data);
    return expenses.find((e) => e.id === id) || null;
  },

  /**
   * Create a new expense.
   */
  async createExpense(expense) {
    const headers = await authHeader();
    const { data } = await api.post("/expenses", expense, { headers });
    return data;
  },

  /**
   * Update an existing expense by ID.
   */
  async updateExpense(id, expense) {
    const headers = await authHeader();
    const { data } = await api.put(`/expenses/${id}`, expense, { headers });
    return data;
  },

  /**
   * Delete an expense by ID.
   */
  async deleteExpense(id) {
    const headers = await authHeader();
    const { data } = await api.delete(`/expenses/${id}`, { headers });
    return data;
  },

  /**
   * Return the N most-recent expenses (sorted by date descending).
   */
  async getRecentExpenses(count = 5) {
    const headers = await authHeader();
    const { data } = await api.get("/expenses", { headers });
    const expenses = normalizeExpenses(data.expenses ?? data);

    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    return expenses.slice(0, count);
  },

  /**
   * Sum of all expenses whose date matches today (local time zone).
   */
  async getTodaySpending() {
    const headers = await authHeader();
    const { data } = await api.get("/expenses", { headers });
    const expenses = normalizeExpenses(data.expenses ?? data);

    const today = new Date().toISOString().split("T")[0];
    return expenses
      .filter((e) => e.date === today)
      .reduce((sum, e) => sum + e.amount, 0);
  },
};