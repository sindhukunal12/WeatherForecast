import React from 'react';
import { CloudRain, RefreshCw, Activity } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import ThemeToggle from './ThemeToggle';
import TemperatureToggle from './TemperatureToggle';

const Navbar = () => {
  const { refreshWeather, loading, backendOnline } = useWeather();

  return (
    <header
      className="glass-panel"
      style={{
        margin: '1rem',
        padding: '0.85rem 1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: '1rem',
        zIndex: 50,
      }}
    >
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
          }}
        >
          <CloudRain size={20} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Weather<span style={{ color: 'var(--accent-glow)' }}>Pulse</span>
          </h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            Monitoring System
          </span>
        </div>
      </div>

      {/* Control Actions: Refresh, Units, Theme, Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Backend Connectivity Status Badge */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
          }}
          className="desktop-status"
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: backendOnline ? 'var(--status-success)' : 'var(--status-error)',
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>
            {backendOnline ? 'API Connected' : 'Offline'}
          </span>
        </div>

        {/* Refresh Weather Button */}
        <button
          onClick={refreshWeather}
          disabled={loading}
          title="Refresh current weather data"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            padding: '0.45rem',
            borderRadius: 'var(--radius-md)',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
          }}
        >
          <RefreshCw
            size={16}
            style={{
              animation: loading ? 'spin 1s linear infinite' : 'none',
            }}
          />
        </button>

        {/* Temperature Unit Toggle (°C / °F) */}
        <TemperatureToggle />

        {/* Theme Toggle (Dark / Light) */}
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;

