import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Compass, Heart, History, Settings, ExternalLink } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const Sidebar = () => {
  const { favorites, history } = useWeather();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/details', label: 'City Details', icon: <Compass size={18} /> },
    {
      to: '/favorites',
      label: 'Favorites',
      icon: <Heart size={18} />,
      badge: favorites.length > 0 ? favorites.length : null,
    },
    {
      to: '/history',
      label: 'Search History',
      icon: <History size={18} />,
      badge: history.length > 0 ? history.length : null,
    },
    { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className="glass-panel"
      style={{
        margin: '0 0 1rem 1rem',
        padding: '1.25rem 1rem',
        width: '240px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <div>
        <span
          style={{
            fontSize: '0.725rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            paddingLeft: '0.75rem',
            marginBottom: '0.75rem',
            display: 'block',
          }}
        >
          Navigation
        </span>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                transition: 'all var(--transition-fast)',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-surface-elevated)',
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Internship Project Footer Badge in Sidebar */}
      <div
        style={{
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
        }}
      >
        <span style={{ color: 'var(--text-accent)', fontWeight: '600', display: 'block' }}>
          6-Week Internship
        </span>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Python &amp; Full Stack Web Development
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

