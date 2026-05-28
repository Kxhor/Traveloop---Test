/**
 * Optimized API Client with Caching & Request Deduplication
 */

import { API_BASE } from './config.js';
import { getCache, setCache, clearCache } from './utils.js';

function getToken() {
  return localStorage.getItem('zuno_token');
}

function setToken(token) {
  localStorage.setItem('zuno_token', token);
}

function clearToken() {
  localStorage.removeItem('zuno_token');
  localStorage.removeItem('zuno_user');
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('zuno_user'));
  } catch {
    return null;
  }
}

function setStoredUser(user) {
  localStorage.setItem('zuno_user', JSON.stringify(user));
}

// Track pending requests to avoid duplicates
const pendingRequests = new Map();

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Check cache for GET requests
  if (options.method === 'GET' || !options.method) {
    const cached = getCache(path);
    if (cached) {
      console.log(`📦 Cache hit: ${path}`);
      return cached;
    }
  }

  // Deduplicate pending requests
  const requestKey = `${options.method || 'GET'}:${path}`;
  if (pendingRequests.has(requestKey)) {
    console.log(`⏳ Waiting for pending request: ${requestKey}`);
    return pendingRequests.get(requestKey);
  }

  // Make request
  const requestPromise = fetch(url, { ...options, headers })
    .then(async res => {
      if (res.status === 204) return null;

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = (data && (data.detail || data.message)) || `Request failed (${res.status})`;
        throw new Error(msg);
      }

      // Cache successful GET responses
      if (!options.method || options.method === 'GET') {
        setCache(path, data, 60000); // 1 minute cache
      }

      return data;
    })
    .finally(() => {
      pendingRequests.delete(requestKey);
    });

  pendingRequests.set(requestKey, requestPromise);
  return requestPromise;
}

export const api = {
  auth: {
    async login(emailOrUsername, password) {
      const email = emailOrUsername.includes('@') ? emailOrUsername : emailOrUsername + '@traveloop.local';

      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!data.access_token) {
        throw new Error('No access token received');
      }

      setToken(data.access_token);

      try {
        const user = await api.auth.me();
        setStoredUser(user);
        return { access_token: data.access_token, token_type: data.token_type, user };
      } catch (e) {
        const user = { username: emailOrUsername, email };
        setStoredUser(user);
        return { access_token: data.access_token, token_type: data.token_type, user };
      }
    },

    async register(username, email, password) {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });
      setStoredUser(data);
      return data;
    },

    async me() {
      return request('/auth/me');
    },

    logout() {
      clearToken();
      clearCache();
    },

    isAuthenticated() {
      return !!getToken();
    },

    getUser() {
      return getStoredUser();
    },
  },

  trips: {
    async list() {
      return request('/trips/');
    },

    async get(id) {
      return request(`/trips/${id}`);
    },

    async create(data) {
      clearCache('trips'); // Invalidate cache
      return request('/trips/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      clearCache('trips');
      clearCache(`trips/${id}`);
      return request(`/trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      clearCache('trips');
      clearCache(`trips/${id}`);
      return request(`/trips/${id}`, { method: 'DELETE' });
    },
  },

  stops: {
    async list(tripId) {
      return request(`/stops/trip/${tripId}`);
    },

    async get(id) {
      return request(`/stops/${id}`);
    },

    async listByTrip(tripId) {
      return request(`/stops/trip/${tripId}`);
    },

    async create(data) {
      clearCache(`stops/trip/${data.trip_id}`);
      return request('/stops/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      clearCache(/stops/);
      return request(`/stops/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      clearCache(/stops/);
      return request(`/stops/${id}`, { method: 'DELETE' });
    },
  },

  activities: {
    async listByStop(stopId) {
      return request(`/activities/stop/${stopId}`);
    },

    async listByTrip(tripId) {
      return request(`/activities/trip/${tripId}`);
    },

    async create(data) {
      clearCache(/activities/);
      return request('/activities/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      clearCache(/activities/);
      return request(`/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      clearCache(/activities/);
      return request(`/activities/${id}`, { method: 'DELETE' });
    },
  },

  expenses: {
    async listByTrip(tripId) {
      return request(`/expenses/trip/${tripId}`);
    },

    async create(data) {
      clearCache(/expenses/);
      clearCache(`trips/${data.trip_id}`);
      return request('/expenses/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      clearCache(/expenses/);
      return request(`/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      clearCache(/expenses/);
      return request(`/expenses/${id}`, { method: 'DELETE' });
    },
  },
};
