/**
 * Stop Service
 * Handles stop management and sequencing
 */

import { api } from '../api.js';

export const stopService = {
  // Create stop
  async create(tripId, stopData) {
    return api.stops.create({
      ...stopData,
      trip_id: tripId,
    });
  },

  // List stops for a trip (already sorted)
  async listByTrip(tripId) {
    const stops = await api.stops.list(tripId);
    return stops.sort((a, b) => a.order_index - b.order_index);
  },

  // Get single stop
  async get(stopId) {
    return api.stops.get(stopId);
  },

  // Update stop
  async update(stopId, data) {
    return api.stops.update(stopId, data);
  },

  // Delete stop
  async delete(stopId) {
    return api.stops.delete(stopId);
  },

  // Reorder stops
  async reorder(tripId, stopIds) {
    // Update order_index for each stop
    const updatePromises = stopIds.map((stopId, index) =>
      this.update(stopId, { order_index: index })
    );
    return Promise.all(updatePromises);
  },

  // Calculate duration for a stop
  calculateDuration(stop) {
    if (!stop.arrival_date || !stop.departure_date) return 0;
    const arrivalDate = new Date(stop.arrival_date);
    const departureDate = new Date(stop.departure_date);
    return Math.ceil((departureDate - arrivalDate) / (1000 * 60 * 60 * 24)) + 1;
  },

  // Format stop for display
  format(stop) {
    return {
      ...stop,
      arrivalDate: stop.arrival_date ? new Date(stop.arrival_date).toLocaleDateString() : 'N/A',
      departureDate: stop.departure_date ? new Date(stop.departure_date).toLocaleDateString() : 'N/A',
      duration: this.calculateDuration(stop),
      fullName: `${stop.city}${stop.country ? ', ' + stop.country : ''}`,
    };
  },
};
