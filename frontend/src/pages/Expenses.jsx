import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Receipt } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { expenseService } from '../services/expenseService';
import { CATEGORIES, getCategoryColor } from '../data/categories';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useDebounce } from '../hooks/useDebounce';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';

const emptyForm = { title: '', category: 'food', amount: '', date: new Date().toISOString().split('T')[0], notes: '' };

const Expenses = () => {
  const { success, error } = useToast();

  // State
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const result = await expenseService.getExpenses({
        search: debouncedSearch,
        category,
        sortBy,
        sortOrder,
        page,
        perPage: 8,
      });
      setExpenses(result.data);
      setPagination({ total: result.total, totalPages: result.totalPages, currentPage: result.currentPage });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  // Form handling
  const openAdd = () => {
    setEditingExpense(null);
    setForm(emptyForm);
    setFormErrors({});
    setShowForm(true);
  };

  const openEdit = (expense) => {
    setEditingExpense(expense);
    setForm({
      title: expense.title,
      category: expense.category,
      amount: String(expense.amount),
      date: expense.date,
      notes: expense.notes || '',
    });
    setFormErrors({});
    setShowForm(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.amount || parseFloat(form.amount) <= 0) errors.amount = 'Valid amount required';
    if (!form.date) errors.date = 'Date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const data = { ...form, amount: parseFloat(form.amount) };
      if (editingExpense) {
        await expenseService.updateExpense(editingExpense.id, data);
        success('Expense updated successfully!');
      } else {
        await expenseService.createExpense(data);
        success('Expense added successfully!');
      }
      setShowForm(false);
      fetchExpenses();
    } catch {
      error('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await expenseService.deleteExpense(deleteTarget.id);
      success('Expense deleted successfully!');
      setDeleteTarget(null);
      fetchExpenses();
    } catch {
      error('Failed to delete expense.');
    } finally {
      setDeleting(false);
    }
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...CATEGORIES.map((c) => ({ value: c.id, label: c.name })),
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'amount-desc', label: 'Highest Amount' },
    { value: 'amount-asc', label: 'Lowest Amount' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Expenses</h1>
          <p className="text-sm text-text-muted mt-1">
            {pagination.total} total expense{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Button icon={Plus} onClick={openAdd}>
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <Card padding={false} className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search expenses..."
            className="flex-1"
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categoryOptions}
            className="sm:w-48"
          />
          <Select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-');
              setSortBy(by);
              setSortOrder(order);
            }}
            options={sortOptions}
            className="sm:w-48"
          />
        </div>
      </Card>

      {/* Expenses List */}
      {loading ? (
        <Spinner.Page />
      ) : expenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses found"
          description={search || category ? 'Try adjusting your filters' : 'Start by adding your first expense'}
          action={
            !search && !category ? (
              <Button icon={Plus} onClick={openAdd}>Add Expense</Button>
            ) : null
          }
        />
      ) : (
        <Card padding={false}>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {[
                    { key: 'title', label: 'Title', sortable: false },
                    { key: 'category', label: 'Category', sortable: false },
                    { key: 'amount', label: 'Amount', sortable: true },
                    { key: 'date', label: 'Date', sortable: true },
                    { key: 'notes', label: 'Notes', sortable: false },
                    { key: 'actions', label: '', sortable: false },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className={`text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3.5
                        ${col.sortable ? 'cursor-pointer hover:text-text-secondary transition-colors select-none' : ''}`}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-text-primary">{expense.title}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge color={getCategoryColor(expense.category)}>
                        {CATEGORIES.find((c) => c.id === expense.category)?.name || expense.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-text-primary">
                        {formatCurrency(expense.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-text-secondary">{formatDate(expense.date)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-text-muted truncate max-w-[200px] block">
                        {expense.notes || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(expense)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(expense)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border">
            {expenses.map((expense) => (
              <div key={expense.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{expense.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{formatDate(expense.date)}</p>
                  </div>
                  <p className="text-sm font-bold text-text-primary">{formatCurrency(expense.amount)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge color={getCategoryColor(expense.category)}>
                    {CATEGORIES.find((c) => c.id === expense.category)?.name || expense.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(expense)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(expense)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {expense.notes && (
                  <p className="text-xs text-text-muted">{expense.notes}</p>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-border">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSubmit} loading={saving}>
              {editingExpense ? 'Save Changes' : 'Add Expense'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="What did you spend on?"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            error={formErrors.title}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount ($)"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              error={formErrors.amount}
            />
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={CATEGORIES.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            error={formErrors.date}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">Notes (optional)</label>
            <textarea
              placeholder="Add a note..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full bg-bg border border-border rounded-lg text-text-primary placeholder-text-muted
                px-4 py-2.5 text-sm transition-colors duration-150 resize-none
                focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
};

export default Expenses;
