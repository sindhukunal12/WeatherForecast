import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { weatherApi } from '../services/api';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [activeCity, setActiveCity] = useState(() => {
    return localStorage.getItem('weatherpulse_city') || 'London';
  });
  const [units, setUnits] = useState(() => {
    return localStorage.getItem('weatherpulse_units') || 'metric';
  });

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [backendOnline, setBackendOnline] = useState(true);

  // Fetch Weather and Forecast for a specified city
  const fetchWeatherData = useCallback(
    async (cityName, unitParam = units) => {
      if (!cityName || !cityName.trim()) return;
      const targetCity = cityName.trim();
      setLoading(true);
      setError(null);

      try {
        const [weatherRes, forecastRes] = await Promise.all([
          weatherApi.getCurrentWeather(targetCity, unitParam),
          weatherApi.getForecast(targetCity, unitParam),
        ]);

        setCurrentWeather(weatherRes);
        setForecast(forecastRes);
        setActiveCity(weatherRes.city || targetCity);
        localStorage.setItem('weatherpulse_city', weatherRes.city || targetCity);
        setBackendOnline(true);

        // Refresh search history list after successful lookup
        fetchHistory();
      } catch (err) {
        console.error('Weather fetch error:', err);
        const errMsg =
          err.response?.data?.error ||
          (err.message === 'Network Error'
            ? 'Backend server unreachable. Ensure Flask backend is running on http://localhost:5000'
            : err.message || 'Failed to fetch weather data');
        setError(errMsg);
        if (err.message === 'Network Error') {
          setBackendOnline(false);
        }
      } finally {
        setLoading(false);
      }
    },
    [units]
  );

  // Toggle unit between Celsius and Fahrenheit
  const toggleUnits = useCallback(() => {
    const nextUnit = units === 'metric' ? 'imperial' : 'metric';
    setUnits(nextUnit);
    localStorage.setItem('weatherpulse_units', nextUnit);
    if (activeCity) {
      fetchWeatherData(activeCity, nextUnit);
    }
  }, [units, activeCity, fetchWeatherData]);

  // Load Favorites from Database
  const fetchFavorites = useCallback(async (withWeather = true) => {
    try {
      const data = await weatherApi.getFavorites(withWeather, units);
      setFavorites(data);
    } catch (err) {
      console.warn('Error fetching favorites:', err);
    }
  }, [units]);

  // Add city to favorites
  const addFavorite = async (cityObj) => {
    try {
      const payload = {
        city_name: cityObj.city || activeCity,
        country: cityObj.country || '',
        latitude: cityObj.coordinates?.lat,
        longitude: cityObj.coordinates?.lon,
      };
      const res = await weatherApi.addFavorite(payload);
      if (res.favorite) {
        await fetchFavorites(true);
      }
      return { success: true, message: 'Added to favorites' };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to add favorite';
      return { success: false, message: msg };
    }
  };

  // Remove city from favorites
  const removeFavorite = async (id) => {
    try {
      await weatherApi.deleteFavorite(id);
      setFavorites((prev) => prev.filter((item) => item.id !== id));
      return { success: true, message: 'Removed from favorites' };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to remove favorite';
      return { success: false, message: msg };
    }
  };

  // Helper: check if a city is currently favorited
  const isCityFavorite = useCallback(
    (cityName) => {
      if (!cityName) return false;
      return favorites.some(
        (f) => f.city_name.toLowerCase() === cityName.toLowerCase()
      );
    },
    [favorites]
  );

  // Load Search History from Database
  const fetchHistory = useCallback(async () => {
    try {
      const data = await weatherApi.getHistory(15);
      setHistory(data);
    } catch (err) {
      console.warn('Error fetching history:', err);
    }
  }, []);

  // Clear Search History
  const clearHistory = async () => {
    try {
      await weatherApi.clearHistory();
      setHistory([]);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  // Initial load on mount
  useEffect(() => {
    fetchWeatherData(activeCity, units);
    fetchFavorites(true);
    fetchHistory();
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        activeCity,
        currentWeather,
        forecast,
        loading,
        error,
        units,
        favorites,
        history,
        backendOnline,
        fetchWeatherData,
        toggleUnits,
        refreshWeather: () => fetchWeatherData(activeCity, units),
        fetchFavorites,
        addFavorite,
        removeFavorite,
        isCityFavorite,
        fetchHistory,
        clearHistory,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

