/**
 * Trip Service
 * Handles trip CRUD and aggregated calculations
 */

import { api } from '../api.js';
import { expenseService } from './expense-service.js';

export const tripService = {
  // Create trip
  async create(tripData) {
    return api.trips.create(tripData);
  },

  // List all trips
  async list() {
    return api.trips.list();
  },

  // Get trip with all related data
  async getComplete(tripId) {
    const trip = await api.trips.get(tripId);
    const stops = await api.stops.list(tripId);
    const expenses = await api.expenses.listByTrip(tripId);

    return {
      ...trip,
      stops,
      expenses,
      totalSpent: expenseService.calculateTotal(expenses),
      remaining: (trip.total_budget || 0) - expenseService.calculateTotal(expenses),
    };
  },

  // Update trip
  async update(tripId, data) {
    return api.trips.update(tripId, data);
  },

  // Delete trip
  async delete(tripId) {
    return api.trips.delete(tripId);
  },

  // Calculate trip stats
  calculateStats(trip, expenses = []) {
    const spent = expenseService.calculateTotal(expenses);
    const budget = trip.total_budget || 0;
    const remaining = budget - spent;
    const percentUsed = budget > 0 ? (spent / budget) * 100 : 0;

    return {
      budget,
      spent,
      remaining,
      percentUsed: Math.min(100, Math.round(percentUsed)),
      isOverBudget: remaining < 0,
    };
  },

  // Format trip for display
  format(trip) {
    return {
      ...trip,
      formattedBudget: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(trip.total_budget || 0),
      startDate: trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'N/A',
      endDate: trip.end_date ? new Date(trip.end_date).toLocaleDateString() : 'N/A',
      days: trip.start_date && trip.end_date 
        ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)) + 1
        : 0,
    };
  },
};
