import React from 'react';
import { useWeather } from '../context/WeatherContext';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import WeatherDetails from '../components/WeatherDetails';
import ForecastCard from '../components/ForecastCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const DashboardPage = () => {
  const { currentWeather, forecast, loading, error, refreshWeather } = useWeather();

  return (
    <div>
      {/* City Search Bar */}
      <SearchBar />

      {/* Error Message with Retry */}
      {error && <ErrorMessage message={error} onRetry={refreshWeather} />}

      {/* Loading State or Main Weather Content */}
      {loading ? (
        <div>
          <LoadingSkeleton type="hero" />
          <div style={{ marginTop: '2rem' }}>
            <LoadingSkeleton type="card" />
          </div>
        </div>
      ) : (
        currentWeather && (
          <>
            {/* Current Weather Hero */}
            <CurrentWeather data={currentWeather} />

            {/* Weather Atmospheric Metrics */}
            <WeatherDetails data={currentWeather} />

            {/* 5-Day Weather Forecast */}
            <ForecastCard forecastData={forecast} />
          </>
        )
      )}
    </div>
  );
};

export default DashboardPage;

