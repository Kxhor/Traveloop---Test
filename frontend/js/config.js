// API configuration
// In development, requests go through the local dev server at /api
// In production, this would point to the actual backend URL
export const API_BASE = window.location.hostname === 'localhost'
  ? '/api'
  : 'https://api.traveloop.com/api';
