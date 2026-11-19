import React from 'react';
import { useWeather } from '../context/WeatherContext';

const TemperatureToggle = () => {
  const { units, toggleUnits } = useWeather();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '2px',
      }}
    >
      <button
        onClick={() => units !== 'metric' && toggleUnits()}
        style={{
          border: 'none',
          padding: '0.35rem 0.65rem',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: '600',
          background: units === 'metric' ? 'var(--accent-blue)' : 'transparent',
          color: units === 'metric' ? '#ffffff' : 'var(--text-secondary)',
          transition: 'all var(--transition-fast)',
        }}
        title="Metric (°C, m/s)"
      >
        °C
      </button>
      <button
        onClick={() => units !== 'imperial' && toggleUnits()}
        style={{
          border: 'none',
          padding: '0.35rem 0.65rem',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: '600',
          background: units === 'imperial' ? 'var(--accent-blue)' : 'transparent',
          color: units === 'imperial' ? '#ffffff' : 'var(--text-secondary)',
          transition: 'all var(--transition-fast)',
        }}
        title="Imperial (°F, mph)"
      >
        °F
      </button>
    </div>
  );
};

export default TemperatureToggle;

