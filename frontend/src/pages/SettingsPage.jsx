import React, { useState, useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { weatherApi } from '../services/api';
import { Settings, Shield, Key, Database, Server, CheckCircle2, AlertCircle } from 'lucide-react';

const SettingsPage = () => {
  const { units, toggleUnits, activeCity, fetchWeatherData } = useWeather();
  const { theme, toggleTheme } = useTheme();

  const [defaultCity, setDefaultCity] = useState(activeCity || 'London');
  const [saveStatus, setSaveStatus] = useState('');
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    weatherApi
      .getHealth()
      .then((data) => {
        setHealthData(data);
      })
      .catch((err) => {
        setHealthData({ status: 'unreachable', error: err.message });
      })
      .finally(() => {
        setHealthLoading(false);
      });
  }, []);

  const handleSaveDefaultCity = (e) => {
    e.preventDefault();
    if (!defaultCity.trim()) return;
    localStorage.setItem('weatherpulse_city', defaultCity.trim());
    fetchWeatherData(defaultCity.trim());
    setSaveStatus('Default city updated successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
          System Settings &amp; Preferences
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Configure metric preferences, visual themes, and monitor backend diagnostics
        </p>
      </div>

      {/* Preferences Section */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={18} color="var(--accent-glow)" />
          <span>Application Preferences</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Temperature Units Preference */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block' }}>
                Temperature Unit
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Select Celsius (°C, m/s) or Fahrenheit (°F, mph) for global display
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => units !== 'metric' && toggleUnits()}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: units === 'metric' ? 'var(--accent-blue)' : 'var(--bg-surface)',
                  color: units === 'metric' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => units !== 'imperial' && toggleUnits()}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: units === 'imperial' ? 'var(--accent-blue)' : 'var(--bg-surface)',
                  color: units === 'imperial' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

          {/* Theme Preference */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block' }}>
                Interface Visual Theme
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Toggle between dark navy glassmorphic theme and high-contrast light theme
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => theme !== 'dark' && toggleTheme()}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: theme === 'dark' ? 'var(--accent-blue)' : 'var(--bg-surface)',
                  color: theme === 'dark' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Dark Theme
              </button>
              <button
                onClick={() => theme !== 'light' && toggleTheme()}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: theme === 'light' ? 'var(--accent-blue)' : 'var(--bg-surface)',
                  color: theme === 'light' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Light Theme
              </button>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

          {/* Default Starting City */}
          <div>
            <form onSubmit={handleSaveDefaultCity} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                Default Starting City
              </label>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                The city loaded automatically when the application opens
              </span>
              <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '400px' }}>
                <input
                  type="text"
                  value={defaultCity}
                  onChange={(e) => setDefaultCity(e.target.value)}
                  placeholder="e.g. London, Mumbai, Tokyo..."
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-blue)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Save
                </button>
              </div>
              {saveStatus && (
                <span style={{ fontSize: '0.8rem', color: 'var(--status-success)', marginTop: '0.25rem' }}>
                  {saveStatus}
                </span>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Backend Diagnostics & Health Section */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Server size={18} color="var(--accent-cyan)" />
          <span>Backend Architecture &amp; System Health</span>
        </h3>

        {healthLoading ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pinging backend diagnostics...</p>
        ) : healthData ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>REST API Status</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: healthData.status === 'healthy' ? 'var(--status-success)' : 'var(--status-error)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                {healthData.status === 'healthy' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {healthData.status === 'healthy' ? 'Online / Healthy' : 'Offline'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>SQLite Persistence</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-glow)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                <Database size={16} />
                {healthData.database === 'connected' ? 'Connected' : 'Unavailable'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>External API Key</span>
              <span style={{ fontSize: '1rem', fontWeight: '600', color: healthData.api_key_configured ? 'var(--status-success)' : 'var(--status-warning)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                <Key size={16} />
                {healthData.api_key_configured ? 'Configured (Live)' : 'Calibrated Engine'}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {/* OpenWeatherMap API Integration Instructions */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={18} color="var(--accent-glow)" />
          <span>OpenWeatherMap API Key Configuration</span>
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          To enable live weather fetching from the OpenWeatherMap API:
        </p>
        <ol style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1.25rem', lineHeight: 1.8 }}>
          <li>Sign up for a free account at <strong>https://openweathermap.org/api</strong>.</li>
          <li>Generate an API key under your OpenWeather account dashboard.</li>
          <li>Open <code>backend/.env</code> in your project directory.</li>
          <li>Set <code>OPENWEATHER_API_KEY=your_actual_key_here</code> and restart the Flask server.</li>
        </ol>
      </div>
    </div>
  );
};

export default SettingsPage;
