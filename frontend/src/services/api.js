/**
 * Axios API Service Client for Weather Forecast & Monitoring System.
 * Connects React frontend to Flask backend via /api endpoints.
 */

import axios from 'axios';

// Base URL falls back to relative /api which is proxied by Vite dev server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const weatherApi = {
  // Health & Diagnostic
  getHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Real-time Weather
  getCurrentWeather: async (city, units = 'metric') => {
    const response = await apiClient.get(`/weather/${encodeURIComponent(city)}`, {
      params: { units },
    });
    return response.data;
  },

  // 5-Day Forecast
  getForecast: async (city, units = 'metric') => {
    const response = await apiClient.get(`/forecast/${encodeURIComponent(city)}`, {
      params: { units },
    });
    return response.data;
  },

  // Location Autocomplete / Search Suggestions
  searchLocations: async (query) => {
    if (!query || !query.trim()) return [];
    try {
      const response = await apiClient.get('/search', {
        params: { q: query.trim() },
      });
      return response.data || [];
    } catch (e) {
      console.warn('Search suggestions fallback:', e);
      return [];
    }
  },

  // Favorites Management
  getFavorites: async (withWeather = false, units = 'metric') => {
    try {
      const response = await apiClient.get('/favorites', {
        params: { with_weather: withWeather, units },
      });
      if (typeof response.data === 'string') {
        console.warn('getFavorites received string response instead of JSON');
        return [];
      }
      return response.data;
    } catch (err) {
      console.warn('getFavorites request error:', err);
      return [];
    }
  },

  addFavorite: async (cityData) => {
    const response = await apiClient.post('/favorites', cityData);
    return response.data;
  },

  deleteFavorite: async (id) => {
    const response = await apiClient.delete(`/favorites/${id}`);
    return response.data;
  },

  // Search History
  getHistory: async (limit = 15) => {
    try {
      const response = await apiClient.get('/history', {
        params: { limit },
      });
      if (typeof response.data === 'string') {
        console.warn('getHistory received string response instead of JSON');
        return [];
      }
      return response.data;
    } catch (err) {
      console.warn('getHistory request error:', err);
      return [];
    }
  },

  addHistory: async (cityName) => {
    const response = await apiClient.post('/history', { city_name: cityName });
    return response.data;
  },

  clearHistory: async () => {
    const response = await apiClient.delete('/history');
    return response.data;
  },
};

export default apiClient;

