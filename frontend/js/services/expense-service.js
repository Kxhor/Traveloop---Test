/**
 * Expense Service
 * Handles expense tracking and budget calculations
 */

import { api } from '../api.js';

export const expenseService = {
  // Create expense
  async create(tripId, expenseData) {
    return api.expenses.create({
      ...expenseData,
      trip_id: tripId,
    });
  },

  // List expenses for a trip
  async listByTrip(tripId) {
    return api.expenses.listByTrip(tripId);
  },

  // Update expense
  async update(expenseId, data) {
    return api.expenses.update(expenseId, data);
  },

  // Delete expense
  async delete(expenseId) {
    return api.expenses.delete(expenseId);
  },

  // Calculate total spent
  calculateTotal(expenses) {
    return expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  },

  // Group expenses by category
  groupByCategory(expenses) {
    return expenses.reduce((groups, exp) => {
      const category = exp.category || 'Other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(exp);
      return groups;
    }, {});
  },

  // Calculate category totals
  categoryTotals(expenses) {
    const grouped = this.groupByCategory(expenses);
    const totals = {};
    Object.entries(grouped).forEach(([category, items]) => {
      totals[category] = items.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    });
    return totals;
  },

  // Helper: format expense for display
  format(expense) {
    return {
      ...expense,
      formattedAmount: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: expense.currency || 'USD',
      }).format(expense.amount),
      formattedDate: expense.created_at ? new Date(expense.created_at).toLocaleDateString() : 'N/A',
    };
  },
};
