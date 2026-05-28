import { API_BASE } from './config.js';

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

  const res = await fetch(url, { ...options, headers });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = (data && (data.detail || data.message)) || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export const api = {
  auth: {
    async login(emailOrUsername, password) {
      // Backend expects email, but accept username for convenience
      // TODO: Backend could support both username and email
      const email = emailOrUsername.includes('@') ? emailOrUsername : emailOrUsername + '@traveloop.local';

      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!data.access_token) {
        throw new Error('No access token received');
      }

      setToken(data.access_token);

      // Fetch current user info
      try {
        const user = await api.auth.me();
        setStoredUser(user);
        return { access_token: data.access_token, token_type: data.token_type, user };
      } catch (e) {
        // If we can't fetch user details, just store minimal info
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
      return request('/trips/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      return request(`/trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      return request(`/trips/${id}`, { method: 'DELETE' });
    },
  },

  stops: {
    async list(tripId) {
      // Fetch all stops for a trip from the backend
      return request(`/stops/trip/${tripId}`);
    },

    async get(id) {
      return request(`/stops/${id}`);
    },

    async listByTrip(tripId) {
      return request(`/stops/trip/${tripId}`);
    },

    async create(data) {
      return request('/stops/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      return request(`/stops/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
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
      return request('/activities/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      return request(`/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      return request(`/activities/${id}`, { method: 'DELETE' });
    },
  },

  expenses: {
    async listByTrip(tripId) {
      return request(`/expenses/trip/${tripId}`);
    },

    async create(data) {
      return request('/expenses/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      return request(`/expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      return request(`/expenses/${id}`, { method: 'DELETE' });
    },
  },
};
