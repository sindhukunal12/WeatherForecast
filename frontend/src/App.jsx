import React, { useState, useEffect } from 'react';

function App() {
  const [theme, setTheme] = useState('dark');
  const [backendStatus, setBackendStatus] = useState({ checking: true, connected: false, message: '' });

  useEffect(() => {
    // Check backend health endpoint
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error('Health check failed');
        return res.json();
      })
      .then((data) => {
        setBackendStatus({ checking: false, connected: true, message: data.service });
      })
      .catch((err) => {
        setBackendStatus({ checking: false, connected: false, message: 'Backend not running yet or unreachable' });
      });
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.body.className = `${nextTheme}-theme`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar Placeholder */}
      <header className="glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-gradient)' }}></div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>
            Weather<span style={{ color: 'var(--accent-glow)' }}>Pulse</span>
          </h1>
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', background: 'var(--bg-surface-elevated)', color: 'var(--text-secondary)' }}>
            v1.0-w1
          </span>
        </div>
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          Theme: {theme.toUpperCase()}
        </button>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: '1rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="glass-panel-glow" style={{ padding: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Weather Forecast &amp; Monitoring System
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 1.5rem', fontSize: '1rem' }}>
            Six-Week Internship Project &mdash; Python Development &amp; Full Stack Web Development
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: backendStatus.connected ? 'var(--status-success)' : 'var(--status-warning)' }}></span>
            <span>Backend Health: <strong>{backendStatus.checking ? 'Checking...' : backendStatus.connected ? 'Online (Flask Connected)' : 'Offline (Launch backend)'}</strong></span>
          </div>
        </div>

        {/* Week 1 Architectural Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--accent-glow)' }}>
              Week 1: Foundations
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Architecture design, SQLite &amp; SQLAlchemy schemas, environment configuration, REST API contracts, and Vite/React setup.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>
              Week 2: Backend &amp; APIs
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              OpenWeatherMap integration, real-time weather &amp; 5-day forecasts, error handling, rate-limiting &amp; Pytest suite.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
              Week 3-6: UI, State &amp; Delivery
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Interactive dashboard, Context API, Favorites, Search History, Responsive Glassmorphism, and Evaluation Documentation.
            </p>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Weather Forecast &amp; Monitoring System &copy; 2026. Built with Python Flask &amp; React.js.
      </footer>
    </div>
  );
}

export default App;
