/**
 * Activity Service
 * Handles activity CRUD operations and sync with backend
 */

import { api } from '../api.js';

export const activityService = {
  // Create activity
  async create(stopId, activityData) {
    return api.activities.create({
      ...activityData,
      stop_id: stopId,
    });
  },

  // List activities for a stop
  async listByStop(stopId) {
    return api.activities.listByStop(stopId);
  },

  // List activities for a trip
  async listByTrip(tripId) {
    return api.activities.listByTrip(tripId);
  },

  // Update activity
  async update(activityId, data) {
    return api.activities.update(activityId, data);
  },

  // Delete activity
  async delete(activityId) {
    return api.activities.delete(activityId);
  },

  // Helper: format activity for display
  format(activity) {
    return {
      ...activity,
      scheduledTime: activity.scheduled_at ? new Date(activity.scheduled_at).toLocaleTimeString() : 'Not scheduled',
      duration: activity.duration_minutes ? `${Math.floor(activity.duration_minutes / 60)}h ${activity.duration_minutes % 60}m` : 'N/A',
    };
  },
};
