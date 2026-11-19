import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider } from './context/WeatherContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import CityDetailsPage from './pages/CityDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top Navigation Bar */}
            <Navbar />

            {/* Main Application Body (Sidebar + Routed View) */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                maxWidth: '1440px',
                width: '100%',
                margin: '0 auto',
                padding: '0 1rem 2rem 0',
              }}
              className="main-layout"
            >
              <Sidebar />

              <main
                style={{
                  flex: 1,
                  padding: '0 1rem 0 1.5rem',
                  minWidth: 0,
                }}
              >
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/details" element={<CityDetailsPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>

            {/* Footer */}
            <footer
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                borderTop: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: '0.825rem',
                marginTop: 'auto',
              }}
            >
              WeatherPulse &mdash; Weather Forecast &amp; Monitoring System &bull; Built with Python Flask &amp; React
            </footer>
          </div>
        </Router>
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;
